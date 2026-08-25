// THE INVARIANT: a project belongs to exactly ONE workspace.
//
// Product ruling (2026-07-21): drafts and shared projects belong to a workspace.
// This module is the ONE place that decides which workspace a project belongs
// to when the rows disagree.

/** A `workspace_projects` row, as far as this invariant is concerned. */
export interface WorkspaceProjectHomeRow {
  projectId: string;
  workspaceId: string;
  visibility?: string | null;
  createdByWorkspaceMemberId?: string | null;
  createdAt?: number | null;
}

export function isBackfilledWorkspaceProjectRow(row: WorkspaceProjectHomeRow): boolean {
  return row.visibility === 'personal' && row.createdByWorkspaceMemberId == null;
}

export function teamWorkspaceIdsFromRows(
  rows: readonly WorkspaceProjectHomeRow[],
): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const row of rows) {
    if (row.visibility === 'team') ids.add(row.workspaceId);
  }
  return ids;
}

export interface WorkspaceProjectHomeDecision {
  projectId: string;
  keptWorkspaceId: string | null;
  drop: WorkspaceProjectHomeRow[];
}

function rowEvidence(row: WorkspaceProjectHomeRow): number {
  if (row.visibility === 'team') return 2;
  return isBackfilledWorkspaceProjectRow(row) ? 0 : 1;
}

function recordedActsPerWorkspace(
  rows: readonly WorkspaceProjectHomeRow[],
): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (rowEvidence(row) === 0) continue;
    counts.set(row.workspaceId, (counts.get(row.workspaceId) ?? 0) + 1);
  }
  return counts;
}

export function collapseWorkspaceProjectHomes(
  rows: readonly WorkspaceProjectHomeRow[],
): WorkspaceProjectHomeDecision[] {
  const teamWorkspaceIds = teamWorkspaceIdsFromRows(rows);
  const activity = recordedActsPerWorkspace(rows);
  const byProject = new Map<string, WorkspaceProjectHomeRow[]>();
  for (const row of rows) {
    const bucket = byProject.get(row.projectId);
    if (bucket) bucket.push(row);
    else byProject.set(row.projectId, [row]);
  }

  const decisions: WorkspaceProjectHomeDecision[] = [];
  for (const [projectId, projectRows] of byProject) {
    const winner = [...projectRows].sort((a, b) => {
      const byEvidence = rowEvidence(b) - rowEvidence(a);
      if (byEvidence !== 0) return byEvidence;
      const aSuppressed = rowEvidence(a) === 0 && teamWorkspaceIds.has(a.workspaceId);
      const bSuppressed = rowEvidence(b) === 0 && teamWorkspaceIds.has(b.workspaceId);
      if (aSuppressed !== bSuppressed) return aSuppressed ? 1 : -1;
      const byActivity = (activity.get(b.workspaceId) ?? 0) - (activity.get(a.workspaceId) ?? 0);
      if (byActivity !== 0) return byActivity;
      const byCreatedAt = (a.createdAt ?? 0) - (b.createdAt ?? 0);
      if (byCreatedAt !== 0) return byCreatedAt;
      return a.workspaceId < b.workspaceId ? -1 : a.workspaceId > b.workspaceId ? 1 : 0;
    })[0];
    if (!winner) continue;

    const winnerRendersNowhere =
      rowEvidence(winner) === 0 && teamWorkspaceIds.has(winner.workspaceId);
    if (winnerRendersNowhere) {
      decisions.push({ projectId, keptWorkspaceId: null, drop: projectRows });
      continue;
    }
    const drop = projectRows.filter((row) => row !== winner);
    if (drop.length === 0) continue;
    decisions.push({ projectId, keptWorkspaceId: winner.workspaceId, drop });
  }
  return decisions;
}
