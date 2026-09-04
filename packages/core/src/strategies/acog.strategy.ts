import {CTGFeatures} from "../types/ctg-features";
import {GuidelineStrategy} from "../guideline-strategy.interface";

/**
 * ACOG (American College of Obstetricians and Gynecologists) 3-tier fetal
 * heart rate classification: Category I / II / III.
 *
 * Category II is
 * the catch-all "everything not clearly I or III" tier, matching ACOG's own
 * definition of that category.
 */
export const AcogStrategy: GuidelineStrategy = {
  id: "ACOG",
  label: "ACOG",
  version: "1.0.0-ported",
  categories: ["Category I", "Category II", "Category III"],

  classify(f: CTGFeatures): string {
    // ---------- CATEGORY III ----------
    if (
      (f.baseline < 100 || f.baseline > 180) &&
      f.variability < 2 &&
      (f.lateDecelCount >= 2 ||
        f.variableDecelCount >= 2 ||
        f.prolongedDecelCount > 0) &&
      f.contractionsPer10Min > 5
    ) {
      return "Category III";
    }

    // ---------- CATEGORY I ----------
    if (
      f.baseline >= 110 &&
      f.baseline <= 160 &&
      f.variability >= 6 &&
      f.variability <= 25 &&
      f.earlyDecelCount === 2 &&
      f.contractionsPer10Min <= 5
    ) {
      return "Category I";
    }

    // ---------- CATEGORY II (catch-all) ----------
    return "Category II";
  },
};
