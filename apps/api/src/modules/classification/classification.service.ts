import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BUILT_IN_STRATEGIES,
  CTGFeatures,
  GuidelineId,
  GuidelineStrategy,
} from '@Ctg-Early-Warning-System/core';

@Injectable()
export class ClassificationService {
  private readonly strategies: GuidelineStrategy[] = [...BUILT_IN_STRATEGIES];

  /** All registered guideline strategies (id, label, version, categories) — used to drive the UI's guideline picker. */
  listGuidelines() {
    return this.strategies.map(({ id, label, version, categories }) => ({
      id,
      label,
      version,
      categories,
    }));
  }

  classifyOne(guidelineId: GuidelineId, features: CTGFeatures) {
    const strategy = this.findStrategy(guidelineId);
    return {
      guideline: strategy.id,
      category: strategy.classify(features),
      version: strategy.version,
    };
  }

  classifyAll(features: CTGFeatures) {
    const results = Object.fromEntries(
      this.strategies.map((s) => [s.id, s.classify(features)]),
    ) as Record<GuidelineId, string>;
    return {
      ...results,
      versions: this.strategies.map((s) => s.version),
    };
  }

  private findStrategy(id: GuidelineId): GuidelineStrategy {
    const strategy = this.strategies.find((s) => s.id === id);
    if (!strategy) {
      throw new NotFoundException(`Unknown guideline: ${id}`);
    }
    return strategy;
  }
}
