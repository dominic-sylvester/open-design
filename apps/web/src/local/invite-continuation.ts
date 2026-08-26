/** Cloud team invite continuation — stubbed after OpenDesign Cloud removal. */

export type LocalPendingInviteContinuationStatus =
  | 'pending'
  | 'accepted'
  | 'failed'
  | 'expired'
  | 'opened';

export interface LocalPendingInviteContinuation {
  token: string;
  workspaceId: string;
  status: LocalPendingInviteContinuationStatus;
  lastAttemptAt?: number;
  nonce?: string;
  expiresAt?: number;
}

export interface LocalWorkspaceActivation {
  workspaceId: string;
  workspaceMemberId?: string;
  role?: string;
  memberStatus?: string;
  lifecycleState?: string;
}

export interface WorkspaceInviteAcceptResponse {
  ok: boolean;
  continuation?: LocalPendingInviteContinuation;
  inviteId?: string;
  workspaceId?: string;
  workspaceMemberId?: string;
}

export interface InviteDeeplinkPayload {
  token: string;
  workspaceId?: string;
}

export function buildInviteDeeplink(_payload: InviteDeeplinkPayload): string {
  return '';
}

export function parseInviteDeeplink(_url: string): InviteDeeplinkPayload | null {
  return null;
}

export function readPendingInviteContinuation(): LocalPendingInviteContinuation | null {
  return null;
}

export function writePendingInviteContinuation(_entry: LocalPendingInviteContinuation): void {}

export function clearPendingInviteContinuation(): void {}

export function markPendingInviteContinuationStatus(
  _status: LocalPendingInviteContinuationStatus,
): LocalPendingInviteContinuation | null {
  return null;
}

export function continuationFromInviteAcceptResponse(
  _response: WorkspaceInviteAcceptResponse,
): LocalPendingInviteContinuation {
  return { token: '', workspaceId: '', status: 'pending' };
}

export function activationFromInviteAcceptResponse(
  _response: WorkspaceInviteAcceptResponse,
): LocalWorkspaceActivation {
  return { workspaceId: '' };
}

export function activationMatchesContext(
  _activation: LocalWorkspaceActivation,
  _context: unknown,
): boolean {
  return false;
}
