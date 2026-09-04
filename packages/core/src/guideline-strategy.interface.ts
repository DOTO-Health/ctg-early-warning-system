import { CTGFeatures } from './types/ctg-features';

export type GuidelineId = 'FIGO' | 'NICE' | 'ACOG';

/**
 * One classification strategy per clinical guideline. Each strategy is
 * self-contained and independently testable/versionable — adding a new
 * guideline means implementing this interface and registering it, with no
 * changes required anywhere else in the engine.
 */
export interface GuidelineStrategy {
  readonly id: GuidelineId;

  /** Human-readable label, e.g. for UI display. */
  readonly label: string;

  /** Rule-set version — stored alongside results so historical
   *  classifications stay reproducible even after a rule update. */
  readonly version: string;

  /** All possible category outputs this strategy can return, in the order
   *  they should be displayed (e.g. best -> worst). Used by the UI to
   *  render legends/badges consistently. */
  readonly categories: readonly string[];

  classify(features: CTGFeatures): string;
}
