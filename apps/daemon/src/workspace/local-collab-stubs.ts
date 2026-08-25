/** No-op collab sync seam kept for route/server-context compatibility after cloud removal. */
export function createLocalCollabSyncStub() {
  return {
    requestTeamShare: async (_projectId: string, _share?: unknown) => ({ version: null as number | null }),
    requestTeamUnshare: async (_projectId: string, _share?: unknown) => {},
    refreshTeamProjectMetadata: (_projectId: string) => {},
    invalidateTeamProjectCatalog: () => {},
  };
}

/** Dev provider for team-resource copy guard (always personal without cloud hub). */
export { createDevTeamResourceStateProvider } from './team-resource-state.js';
