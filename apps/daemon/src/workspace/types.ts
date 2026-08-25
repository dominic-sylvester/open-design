/** Local workspace types retained after OpenDesign Cloud removal. */
export type WorkspaceType = 'personal' | 'team';

export type WorkspaceCollabContext = {
  workspaceId: string;
  workspaceName?: string;
  workspaceType: WorkspaceType;
  workspaceMemberId: string;
  role: 'owner' | 'admin' | 'member';
  memberStatus: 'active' | 'removed';
  lifecycleState: 'active' | 'billing_past_due' | 'locked' | 'deleting' | 'deleted';
  canShareProjects?: boolean;
  canWriteSyncedFiles?: boolean;
  billingState?: string;
  planId?: string | null;
  providerMode?: string;
  seatSummary?: {
    seatLimit: number;
    usedSeats: number;
    availableSeats: number;
    isSeatFull: boolean;
  };
  permissions?: {
    canManageMembers: boolean;
    canManageBilling: boolean;
    canInviteMembers: boolean;
    canManageAutoRecharge: boolean;
    canShareProjects: boolean;
    canWriteSyncedFiles: boolean;
    canViewWorkspaceSettings: boolean;
    canManageSharedResources: boolean;
  };
  teamId?: string;
};

export type ResourceHubPrincipal = {
  teamId: string;
  memberId: string;
  role: 'owner' | 'admin' | 'member';
  lifecycleState: 'active' | 'billing_past_due' | 'locked' | 'deleting' | 'deleted';
  workspaceType: 'personal' | 'team';
};

export type TeamResourceState = 'active' | 'frozen' | 'deleted';

export type TeamResourceCopyTarget =
  | { scope: 'personal' }
  | { scope: 'team'; state: TeamResourceState };

export function assertTeamResourceCopyAllowed(target: TeamResourceCopyTarget): void {
  if (target.scope === 'team' && target.state === 'frozen') {
    throw new TeamResourceCopyForbiddenError();
  }
}

export class TeamResourceCopyForbiddenError extends Error {
  readonly code = 'TEAM_RESOURCE_COPY_FORBIDDEN';
  constructor(message = 'TEAM_RESOURCE_COPY_FORBIDDEN') {
    super(message);
    this.name = 'TeamResourceCopyForbiddenError';
  }
}

export type WorkspaceDirectoryItem = {
  workspaceId: string;
  workspaceType?: WorkspaceType | null;
  workspaceName?: string | null;
};

export type WorkspaceDirectoryResponse = {
  items: WorkspaceDirectoryItem[];
};
