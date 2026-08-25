export const AMR_LOGIN_POLL_INTERVAL_MS = 2000;
export const AMR_LOGIN_TIMEOUT_MS = 5 * 60 * 1000;
export const AMR_LOGIN_STARTUP_SETTLE_MS = 3000;
export const AMR_LOGIN_STATUS_EVENT = 'od:amr-login-status-change';

export type AmrLoginPollOutcome = 'pending' | 'signed-in' | 'stopped' | 'timed-out';
export type AmrLoginStatusEventReason =
  | 'signed-in'
  | 'signed-out'
  | 'poll'
  | 'cancel'
  | 'login-canceled'
  | 'login-started'
  | 'status-changed';

export function isAmrSessionAuthenticated(_status: unknown): boolean {
  return false;
}

export function amrLoginPollOutcome(_status: unknown, _startedAt?: number): AmrLoginPollOutcome {
  return 'stopped';
}

export function notifyAmrLoginStatusChanged(_reason?: AmrLoginStatusEventReason): void {}

export function amrLoginStatusEventReason(_detail: unknown): AmrLoginStatusEventReason {
  return 'poll';
}
