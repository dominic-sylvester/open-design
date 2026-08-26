import type { AmrEntryAttribution } from './amr-attribution';

type Track = (
  event: string,
  properties: Record<string, unknown>,
  options?: { requestId?: string; insertId?: string },
) => void;

export function createAmrAuthAttemptId(): string {
  return 'local-stub';
}

export function beginAmrAuthTracking(
  _attribution: AmrEntryAttribution | null | undefined,
  _startedAt: number = Date.now(),
): string {
  return 'local-stub';
}

export function confirmAmrAuthTracking(
  _track: Track,
  _authAttemptId: string,
  _props?: Record<string, unknown>,
): void {}

export function observeAmrAuthTracking(
  _track: Track,
  _result: unknown,
  _authAttemptId: string,
): void {}

export function reconcileAmrAuthAttemptId(
  provisional: string,
  _daemonId?: string | null,
  _opts?: { joinedExisting?: boolean },
): string {
  return provisional;
}

export function resolveAmrAuthTracking(
  _track: Track,
  _result: string,
  _errorCode: string | undefined,
  _options: { authAttemptId: string; signedInUserId?: string | null },
): void {}

export type ObservableAmrAuthStatus = {
  ok?: boolean;
  alreadyRunning?: boolean;
  authAttemptId?: string;
};
