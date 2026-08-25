/** Stub after OpenDesign Cloud removal. */
export type VelaChildRuntimeFact = Record<string, unknown>;

export function adaptVelaChildRuntimeFactV1(_fact: VelaChildRuntimeFact): null {
  return null;
}

export type VelaChildEvidenceConsumer = {
  observe: (...args: unknown[]) => { handled?: boolean; reason?: string } | void;
  negotiate: (...args: unknown[]) => { advertised?: boolean; [key: string]: unknown } | void;
  childEvidenceCoverage: (...args: unknown[]) => unknown;
  finalize: (...args: unknown[]) => Record<string, unknown>;
};

export function createVelaChildEvidenceConsumer(): VelaChildEvidenceConsumer {
  return {
    observe: () => {},
    negotiate: () => {},
    childEvidenceCoverage: () => undefined,
    finalize: () => ({}),
  };
}
