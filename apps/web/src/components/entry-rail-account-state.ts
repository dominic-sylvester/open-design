export type EntryRailAccountFooterState = 'hidden';

export function shouldShowCreditsBalance(_input: {
  tier: string | null | undefined;
  balanceUsd: string | null | undefined;
}): boolean {
  return false;
}

export function requiresAmrReauthentication(
  _amrSessionState?: unknown,
  _workspaceFailure?: unknown,
): boolean {
  return false;
}

export function resolveEntryRailAccountFooterState(): EntryRailAccountFooterState {
  return 'hidden';
}
