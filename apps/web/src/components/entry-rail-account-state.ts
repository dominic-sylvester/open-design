export type EntryRailAccountFooterState = 'hidden' | 'sign-in' | 'syncing' | 'recovering';

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

export function resolveEntryRailAccountFooterState(
  _workspaceContextState?: unknown,
  _amrLoggedIn?: unknown,
  _amrSessionState?: unknown,
): EntryRailAccountFooterState {
  return 'hidden';
}
