export type WorkspaceAuthorityCacheMode = 'legacy' | 'observe' | 'adaptive';

export function resolveWorkspaceAuthorityCacheMode(
  value: string | undefined,
): WorkspaceAuthorityCacheMode {
  if (value == null || value.trim() === '') return 'adaptive';
  const normalized = value.trim().toLowerCase();
  return normalized === 'observe' || normalized === 'adaptive'
    ? normalized
    : 'legacy';
}

export interface WorkspaceAuthorityHealthCoordinator {
  update(_input: { workspaceId?: string; healthy: boolean }): Promise<void>;
}

/** No-op coordinator after OpenDesign Cloud removal. */
export function createWorkspaceAuthorityHealthCoordinator(): WorkspaceAuthorityHealthCoordinator {
  return {
    async update() {},
  };
}
