/** Stub after OpenDesign Cloud removal. */
export type VelaChildRuntimeFact = Record<string, unknown>;

export function adaptVelaChildRuntimeFactV1(_fact: VelaChildRuntimeFact): null {
  return null;
}

export function createVelaChildEvidenceConsumer(): {
  observe: (...args: unknown[]) => void;
  finalize: (...args: unknown[]) => Record<string, unknown>;
} {
  return {
    observe: () => {},
    finalize: () => ({}),
  };
}
