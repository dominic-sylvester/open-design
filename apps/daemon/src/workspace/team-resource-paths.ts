import { createHash } from 'node:crypto';
import path from 'node:path';

const TEAM_RESOURCE_ROOT = '.team-workspaces';

function workspaceStorageSegment(workspaceId: string): string {
  return createHash('sha256').update(workspaceId).digest('hex');
}

export function teamResourceWorkspaceRoot(
  kindRoot: string,
  workspaceId: string,
): string {
  return path.join(
    kindRoot,
    TEAM_RESOURCE_ROOT,
    workspaceStorageSegment(workspaceId),
  );
}
