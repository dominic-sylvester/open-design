import type { ReactNode } from 'react';

export function AmrArtifactUpgradeGate(props: {
  children?: ReactNode;
  cloudModelSelected?: boolean;
  homeVisible?: boolean;
  activeProjectId?: string | null;
  activeConversationId?: string | null;
  activeFileName?: string | null;
  plan?: string | null;
  planResolved?: boolean;
  profile?: string | null;
  metricsConsent?: boolean;
  installationId?: string | null;
  onHomeOfferChange?: (offer: unknown) => void;
}): ReactNode {
  return props.children ?? null;
}
