import {CTGFeatures} from "../types/ctg-features";
import {GuidelineStrategy} from "../guideline-strategy.interface";

/**
 * FIGO (International Federation of Gynecology and Obstetrics) intrapartum
 * CTG classification: Normal / Suspicious / Pathological.
 *
 * Behaviour is
 * intentionally unchanged from the source — see ARCHITECTURE.md for a note
 * on rule review before relying on this in production.
 */
export const FigoStrategy: GuidelineStrategy = {
  id: "FIGO",
  label: "FIGO",
  version: "1.0.0-ported",
  categories: ["Normal", "Suspicious", "Pathological"],

  classify(f: CTGFeatures): string {
    // ---------- PATHOLOGICAL ----------
    if (
      (f.baseline < 110 || f.baseline > 180) &&
      (f.variability < 5 || f.variability > 25) &&
      (f.lateDecelCount > 0 || f.prolongedDecelCount > 0) &&
      f.accelerationCount === 0 &&
      (f.lateDecelCount > 0 || f.prolongedDecelCount > 0) &&
      (f.lateDecelCount >= 3 ||
        f.prolongedDecelCount >= 3 ||
        f.repetitiveVariable)
    ) {
      return "Pathological";
    }

    // ---------- SUSPICIOUS ----------
    if (
      ((f.baseline >= 100 && f.baseline <= 109) ||
        (f.baseline > 160 && f.baseline <= 180)) &&
      (f.variability < 5 || f.variability > 25) &&
      f.accelerationCount <= 1 &&
      ((f.lateDecelCount >= 1 && f.lateDecelCount <= 2) ||
        (f.prolongedDecelCount >= 1 && f.prolongedDecelCount <= 2))
    ) {
      return "Suspicious";
    }

    // ---------- NORMAL ----------
    return "Normal";
  },
};
