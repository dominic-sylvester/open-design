import type { WorkspaceCollabContext } from './types.js';

/** Empty workspace directory after OpenDesign Cloud removal. */
export async function fetchLocalWorkspaceDirectory(): Promise<{
  ok: true;
  items: never[];
}> {
  return { ok: true, items: [] };
}

export async function fetchFreshBackgroundWorkspaceDirectory(): Promise<{
  ok: false;
  items: never[];
}> {
  return { ok: false, items: [] };
}

export async function resolveAuthoritativeTeamWorkspaceContext(
  _workspaceId: string,
  _options?: { fresh?: boolean; backgroundFresh?: boolean },
): Promise<WorkspaceCollabContext | null> {
  return null;
}

export async function listWorkspaceDirectoryItems(): Promise<never[]> {
  return [];
}
