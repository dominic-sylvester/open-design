/** Local stubs for removed Vela team project catalog integration. */
import type { ResourceHubPrincipal } from './types.js';

export type VelaTeamProjectSyncState =
  | 'pending_upload'
  | 'syncing'
  | 'synced'
  | 'failed';

export interface VelaTeamProjectRecord {
  id: string;
  workspaceId: string;
  projectId: string;
  resourceId: string;
  ownerMemberId: string;
  displayName: string | null;
  syncState: VelaTeamProjectSyncState;
  lastSyncedVersionId: string | null;
  createdAt: string;
  originProjectUpdatedAt: number | null;
  updatedAt: string;
  access: {
    canView: boolean;
    canComment: boolean;
    canEdit: boolean;
    frozen: boolean;
  };
}

export interface VelaTeamProjectCatalogClient {
  list(principal: ResourceHubPrincipal): Promise<VelaTeamProjectRecord[]>;
  get?(projectId: string, workspaceId: string): Promise<VelaTeamProjectRecord | null>;
}

export type WorkspaceDirectoryFetchResult =
  | { ok: true; items: Array<{ workspaceId: string; workspaceType?: string | null }> }
  | { ok: false; items: [] };

export function projectResourceIdFor(
  projectId: string,
  principal?: ResourceHubPrincipal | null,
): string {
  if (!principal) return `project-${projectId}`;
  const scoped = Buffer.from(
    JSON.stringify([principal.teamId, principal.memberId, projectId]),
    'utf8',
  ).toString('base64url');
  return `project-${scoped}`;
}

export function velaProjectSyncStateToProject(
  syncState: VelaTeamProjectSyncState,
): 'local_only' | 'pending_upload' | 'synced' | 'sync_failed' {
  switch (syncState) {
    case 'synced': return 'synced';
    case 'failed': return 'sync_failed';
    case 'pending_upload':
    case 'syncing':
      return 'pending_upload';
    default: return 'local_only';
  }
}
