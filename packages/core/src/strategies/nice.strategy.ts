import {CTGFeatures} from "../types/ctg-features";
import {GuidelineStrategy} from "../guideline-strategy.interface";

/**
 * NICE (UK National Institute for Health and Care Excellence) intrapartum
 * CTG classification: Reassuring / Atypical / Abnormal.
 * on which behaviour is actually correct. See ARCHITECTURE.md.
 */
export const NiceStrategy: GuidelineStrategy = {
  id: "NICE",
  label: "NICE",
  version: "1.0.0-ported",
  categories: ["Reassuring", "Atypical", "Abnormal"],

  classify(f: CTGFeatures): string {
    // ---------- ABNORMAL (ported verbatim — see clinical review flag above) ----------
    if (
      f.baseline < 100 ||
      (f.baseline > 180 &&
        (f.variability < 5 || (f.variability > 25 && f.lateDecelCount > 0)) &&
        (f.lateDecelCount > 0 || f.prolongedDecelCount > 0) &&
        f.contractionsPer10Min > 5)
    ) {
      return "Abnormal";
    }

    // ---------- REASSURING ----------
    if (
      f.baseline >= 110 &&
      f.baseline <= 160 &&
      f.variability >= 5 &&
      f.variability <= 25 &&
      f.accelerationCount > 0 &&
      (f.totalDecelCount === 0 || f.earlyDecelCount === 1) &&
      f.contractionsPer10Min <= 5
    ) {
      return "Reassuring";
    }

    return "Atypical";
  },
};
