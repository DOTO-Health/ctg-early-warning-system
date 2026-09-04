/**
 * Structured CTG (cardiotocography) feature set extracted from a fetal heart
 * rate / uterine contraction trace, either automatically (device/algorithm)
 * or entered manually by a clinician.
 */
export interface CTGFeatures {
  /** Baseline fetal heart rate, in bpm. Normal range ~110-160 bpm. */
  baseline: number;

  /** Baseline variability (bpm). */
  variability: number;

  /** Number of accelerations observed in the analysis window. */
  accelerationCount: number;

  /** Number of late decelerations. */
  lateDecelCount: number;

  /** Number of early decelerations. */
  earlyDecelCount: number;

  /** Number of variable decelerations. */
  variableDecelCount: number;

  /** Number of prolonged decelerations (>=2 min, <10 min). */
  prolongedDecelCount: number;

  /** Total deceleration count across all types (used by some guideline checks). */
  totalDecelCount: number;

  /** Whether repetitive variable decelerations are present. */
  repetitiveVariable: boolean;

  /** Uterine contraction frequency, per 10-minute window. */
  contractionsPer10Min: number;
}
