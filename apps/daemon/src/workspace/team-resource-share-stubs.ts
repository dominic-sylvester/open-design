/** Local stubs for removed Vela team resource sharing after OpenDesign Cloud removal. */
import type { WorkspaceCollabContext, ResourceHubPrincipal } from './types.js';
import type { WorkspaceRequestAuthorityResult } from './workspace-resource-mutation.js';

export interface TeamResourceRequestScope {
  principal: ResourceHubPrincipal;
  canShare: boolean;
}

export interface TeamResourceShareRecord {
  id: string;
  hubResourceId?: string;
  title?: string;
  description?: string;
  ownerMemberId?: string;
  canUnshare?: boolean;
  versionId?: string;
  version?: number;
}

export interface TeamResourceShareService {
  share(
    resourceId: string,
    scope: TeamResourceRequestScope,
  ): Promise<{ version: number } | null>;
  unshare(resourceId: string, scope: TeamResourceRequestScope): Promise<boolean>;
  sharedIds(scope: TeamResourceRequestScope): Promise<string[]>;
  sharedResources(
    scope: TeamResourceRequestScope,
    options?: { authoritative?: boolean },
  ): Promise<TeamResourceShareRecord[]>;
  isShared(resourceId: string, scope: TeamResourceRequestScope): boolean;
  readonly configured: boolean;
}

export interface TeamResourceListCache {
  invalidate(scope: TeamResourceRequestScope): void;
}

function contextToResourceHubPrincipal(
  context: WorkspaceCollabContext,
): ResourceHubPrincipal | null {
  if (context.workspaceType !== 'team') return null;
  const teamId = context.teamId?.trim() || context.workspaceId?.trim();
  const memberId = context.workspaceMemberId?.trim();
  if (!teamId || !memberId) return null;
  return {
    memberId,
    teamId,
    role: context.role,
    lifecycleState: context.lifecycleState,
    workspaceType: context.workspaceType,
  };
}

export function teamResourceRequestScopeFromContext(
  context: WorkspaceCollabContext,
): TeamResourceRequestScope | null {
  const principal = contextToResourceHubPrincipal(context);
  if (!principal || context.memberStatus !== 'active') return null;
  return {
    principal,
    canShare: Boolean(
      context.permissions?.canManageSharedResources
      || context.permissions?.canShareProjects,
    ),
  };
}

export function createLocalTeamResourceShareService(): TeamResourceShareService {
  return {
    share: async () => null,
    unshare: async () => false,
    sharedIds: async () => [],
    sharedResources: async () => [],
    isShared: () => false,
    configured: false,
  };
}

export function createLocalTeamResourceListCache(
  _share: TeamResourceShareService,
): TeamResourceListCache {
  return { invalidate: () => {} };
}

export async function unshareIfCurrentlyShared(
  _service: Pick<TeamResourceShareService, 'sharedResources' | 'unshare'>,
  _resourceId: string,
  _scope: TeamResourceRequestScope,
): Promise<boolean> {
  return false;
}

export function createRememberedTeamResourceScope(): (
  scope: TeamResourceRequestScope,
) => TeamResourceRequestScope {
  return (scope) => scope;
}

export function createResolveTeamResourceScope(deps: {
  verifyExplicitWorkspaceRequestContext: (input: {
    req: unknown;
    requireTeam?: boolean;
  }) => Promise<WorkspaceRequestAuthorityResult>;
  rememberTeamResourceScope: (
    scope: TeamResourceRequestScope,
  ) => TeamResourceRequestScope;
}): (req: unknown) => Promise<
  | Extract<WorkspaceRequestAuthorityResult, { ok: false }>
  | { ok: true; scope: TeamResourceRequestScope }
> {
  return async (req) => {
    const verified = await deps.verifyExplicitWorkspaceRequestContext({
      req,
      requireTeam: true,
    });
    if (!verified.ok) return verified;
    const scope = teamResourceRequestScopeFromContext(verified.context);
    if (!scope) {
      return {
        ok: false as const,
        status: 403 as const,
        code: 'WORKSPACE_ACCESS_DENIED' as const,
        message: 'the requested workspace is not available to this member',
      };
    }
    return {
      ok: true as const,
      scope: deps.rememberTeamResourceScope(scope),
    };
  };
}

export function notifyDesignSystemLinkedMutationNoop(
  _resourceId: string,
  _scope: TeamResourceRequestScope,
  _visibility: 'personal' | 'team',
): void {}
