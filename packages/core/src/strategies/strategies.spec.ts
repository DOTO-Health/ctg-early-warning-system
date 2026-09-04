import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CTGFeatures } from '../types/ctg-features';
import { FigoStrategy } from './figo.strategy';
import { NiceStrategy } from './nice.strategy';
import { AcogStrategy } from './acog.strategy';

const baseFeatures: CTGFeatures = {
  baseline: 140,
  variability: 10,
  accelerationCount: 2,
  lateDecelCount: 0,
  earlyDecelCount: 0,
  variableDecelCount: 0,
  prolongedDecelCount: 0,
  totalDecelCount: 0,
  repetitiveVariable: false,
  contractionsPer10Min: 3,
};

// ---------- FIGO ----------

test('FIGO: healthy trace classifies as Normal', () => {
  assert.equal(FigoStrategy.classify(baseFeatures), 'Normal');
});

test('FIGO: severe abnormal trace classifies as Pathological', () => {
  const f: CTGFeatures = {
    ...baseFeatures,
    baseline: 190,
    variability: 2,
    accelerationCount: 0,
    lateDecelCount: 3,
    prolongedDecelCount: 3,
    repetitiveVariable: true,
  };
  assert.equal(FigoStrategy.classify(f), 'Pathological');
});

test('FIGO: borderline baseline + reduced variability classifies as Suspicious', () => {
  const f: CTGFeatures = {
    ...baseFeatures,
    baseline: 105,
    variability: 3,
    accelerationCount: 1,
    lateDecelCount: 1,
  };
  assert.equal(FigoStrategy.classify(f), 'Suspicious');
});

// ---------- NICE ----------

test('NICE: healthy trace classifies as Reassuring', () => {
  const f: CTGFeatures = { ...baseFeatures, totalDecelCount: 0 };
  assert.equal(NiceStrategy.classify(f), 'Reassuring');
});

test('NICE: baseline < 100 alone triggers Abnormal (documented precedence behaviour)', () => {
  const f: CTGFeatures = { ...baseFeatures, baseline: 95 };
  assert.equal(NiceStrategy.classify(f), 'Abnormal');
});

test('NICE: baseline > 180 requires the full condition set to trigger Abnormal', () => {
  const f: CTGFeatures = { ...baseFeatures, baseline: 190 }; // other fields stay "healthy"
  assert.equal(NiceStrategy.classify(f), 'Atypical');
});

// ---------- ACOG ----------

test('ACOG: healthy trace with earlyDecelCount=2 classifies as Category I', () => {
  const f: CTGFeatures = { ...baseFeatures, earlyDecelCount: 2, variability: 10 };
  assert.equal(AcogStrategy.classify(f), 'Category I');
});

test('ACOG: severe trace classifies as Category III', () => {
  const f: CTGFeatures = {
    ...baseFeatures,
    baseline: 190,
    variability: 1,
    variableDecelCount: 2,
    contractionsPer10Min: 6,
  };
  assert.equal(AcogStrategy.classify(f), 'Category III');
});

test('ACOG: anything not matching I or III falls into Category II', () => {
  assert.equal(AcogStrategy.classify(baseFeatures), 'Category II');
});
