import type { AmrWalletSnapshot } from './types';
import type { WorkspaceCollabContext } from './collab-contracts';

export const AMR_HARD_BLOCK_BALANCE_USD = 0;
export const AMR_LOW_BALANCE_WARN_USD = 2;
export const HOME_AMR_BALANCE_RETRY_DELAYS_MS = [400, 1_200] as const;

export type AmrBalanceGateResult =
  | { kind: 'allow' }
  | { kind: 'unavailable' }
  | { kind: 'hard'; reason: 'insufficient' | 'signed_out'; snapshot: AmrWalletSnapshot }
  | { kind: 'soft'; snapshot: AmrWalletSnapshot };

export interface AmrBalanceGateScope {
  workspaceType: 'personal' | 'team';
  workspaceId: string;
  workspaceMemberId: string;
}

export function isAmrBalanceGateScope(_value: unknown): _value is AmrBalanceGateScope {
  return false;
}

export function amrBalanceGateScopeForWorkspaceContext(
  _context: WorkspaceCollabContext | null | undefined,
): AmrBalanceGateScope | undefined {
  return undefined;
}

export function amrBalanceGateScopesMatch(
  _a: AmrBalanceGateScope | null | undefined,
  _b: AmrBalanceGateScope | null | undefined,
): boolean {
  return false;
}

export function amrWalletBalanceUsd(_snapshot: AmrWalletSnapshot | null | undefined): number | null {
  return null;
}

export function amrWalletBalanceInsufficient(_snapshot: AmrWalletSnapshot | null | undefined): boolean {
  return false;
}

export function isAmrLowBalanceWarnOptedOut(): boolean {
  return true;
}

export function setAmrLowBalanceWarnOptedOut(): void {}

export async function retryUnavailableAmrBalanceGate(
  check: () => Promise<AmrBalanceGateResult>,
): Promise<AmrBalanceGateResult> {
  return check();
}

export async function checkAmrBalanceGate(
  _scope?: AmrBalanceGateScope,
  _modelId?: string | null,
): Promise<AmrBalanceGateResult> {
  return { kind: 'allow' };
}
