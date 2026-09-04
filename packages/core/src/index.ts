export * from './types/ctg-features';
export * from './guideline-strategy.interface';
export * from './strategies/figo.strategy';
export * from './strategies/nice.strategy';
export * from './strategies/acog.strategy';

import { GuidelineStrategy } from './guideline-strategy.interface';
import { FigoStrategy } from './strategies/figo.strategy';
import { NiceStrategy } from './strategies/nice.strategy';
import { AcogStrategy } from './strategies/acog.strategy';

/** All built-in guideline strategies, in display order. */
export const BUILT_IN_STRATEGIES: readonly GuidelineStrategy[] = [
  FigoStrategy,
  NiceStrategy,
  AcogStrategy,
];
