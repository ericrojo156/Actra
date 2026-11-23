import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {TimeSpan} from '../../time/types';
import {
  handleTimeSpanOverlapCase1,
  handleTimeSpanOverlapCase2,
  handleTimeSpanOverlapCase3,
  handleTimeSpanOverlapCase4,
  handleTimeSpanOverlapCase5,
  handleTimeSpanOverlapCase6,
  handleTimeSpanOverlapCase7,
  handleTimeSpanOverlapCase8,
  handleTimeSpanOverlapCase9,
} from '../utils';

// Fixed clock so that running intervals and spans (end null) are measured up to a known "now".
const NOW = 1_000_000_000;

// The overlap handlers mutate their first argument, so every call gets fresh objects.
function span(start: number, end: number | null): TimeSpan {
  return {startTimeEpochMilliseconds: start, endTimeEpochMilliseconds: end};
}

// The time span used for the closed-span cases: 100 to 200.
const SPAN = (): TimeSpan => span(100, 200);

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('A. overlap handlers in src/timeChart/utils.ts (criterion 1)', () => {
  it('Case 1 (interval starts before the span and ends inside it): interval [50,150] gives wasCase true and trimmed [100,150]; interval [120,180] does not match', () => {
    const matched = handleTimeSpanOverlapCase1(span(50, 150), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(100, 150));

    expect(handleTimeSpanOverlapCase1(span(120, 180), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 2 (interval starts inside the span and ends after it): interval [150,250] gives wasCase true and trimmed [150,200]; interval [120,180] does not match', () => {
    const matched = handleTimeSpanOverlapCase2(span(150, 250), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(150, 200));

    expect(handleTimeSpanOverlapCase2(span(120, 180), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 3 (interval wholly after the span): interval [300,400] gives wasCase true and trimmed [0,0]; interval [120,180] does not match', () => {
    const matched = handleTimeSpanOverlapCase3(span(300, 400), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(0, 0));

    expect(handleTimeSpanOverlapCase3(span(120, 180), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 4 (interval wholly before the span): interval [10,50] gives wasCase true and trimmed [0,0]; interval [120,180] does not match', () => {
    const matched = handleTimeSpanOverlapCase4(span(10, 50), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(0, 0));

    expect(handleTimeSpanOverlapCase4(span(120, 180), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 5 (interval inside the span): interval [120,180] gives wasCase true and is unchanged; interval [50,150] does not match', () => {
    const matched = handleTimeSpanOverlapCase5(span(120, 180), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(120, 180));

    expect(handleTimeSpanOverlapCase5(span(50, 150), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 6 (span inside the interval): interval [50,250] gives wasCase true and trimmed [100,200]; interval [120,180] does not match', () => {
    const matched = handleTimeSpanOverlapCase6(span(50, 250), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(100, 200));

    expect(handleTimeSpanOverlapCase6(span(120, 180), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Case 7 (both running, interval starts first): interval [50,null] against span [100,null] gives trimmed [100,null]; a closed interval does not match', () => {
    const matched = handleTimeSpanOverlapCase7(span(50, null), span(100, null));
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(100, null));

    expect(
      handleTimeSpanOverlapCase7(span(50, 150), span(100, null)).wasCase,
    ).toBe(false);
  });

  it('Case 8 (both running, interval starts later): interval [150,null] against span [100,null] gives trimmed [150,null]; a closed interval does not match', () => {
    const matched = handleTimeSpanOverlapCase8(
      span(150, null),
      span(100, null),
    );
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(150, null));

    expect(
      handleTimeSpanOverlapCase8(span(150, 160), span(100, null)).wasCase,
    ).toBe(false);
  });

  it('Case 9 (identical): interval [100,200] against span [100,200] gives wasCase true and trimmed [100,200]; interval [100,150] does not match', () => {
    const matched = handleTimeSpanOverlapCase9(span(100, 200), SPAN());
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(100, 200));

    expect(handleTimeSpanOverlapCase9(span(100, 150), SPAN()).wasCase).toBe(
      false,
    );
  });

  it('Running interval against a closed span that ends before now: interval [150,null] gives case 2 trimmed [150,200]; interval [50,null] gives case 6 trimmed [100,200]', () => {
    const startsInside = handleTimeSpanOverlapCase2(span(150, null), SPAN());
    expect(startsInside.wasCase).toBe(true);
    expect(startsInside.trimmedTimeSpan).toEqual(span(150, 200));

    const startsBefore = handleTimeSpanOverlapCase6(span(50, null), SPAN());
    expect(startsBefore.wasCase).toBe(true);
    expect(startsBefore.trimmedTimeSpan).toEqual(span(100, 200));
  });

  it('Running span, closed interval (running span counts up to now): interval [120,180] against span [100,null] gives case 5, unchanged', () => {
    const matched = handleTimeSpanOverlapCase5(span(120, 180), span(100, null));
    expect(matched.wasCase).toBe(true);
    expect(matched.trimmedTimeSpan).toEqual(span(120, 180));
  });
});
