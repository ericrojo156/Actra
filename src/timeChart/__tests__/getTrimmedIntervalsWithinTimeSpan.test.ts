import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {Interval} from '../../interval/types';
import {TimeSpan} from '../../time/types';
import {getTrimmedIntervalsWithinTimeSpan} from '../useTimePortions';

// Fixed clock so that running intervals and spans (end null) are measured up to a known "now".
const NOW = 1_000_000_000;

function iv(
  intervalId: string,
  parentActivityId: string,
  start: number,
  end: number | null,
): Interval {
  return {
    intervalId,
    parentActivityId,
    startTimeEpochMilliseconds: start,
    endTimeEpochMilliseconds: end,
  };
}

function span(start: number, end: number | null): TimeSpan {
  return {startTimeEpochMilliseconds: start, endTimeEpochMilliseconds: end};
}

// Time span used by the closed-span cases: 100 to 200.
const SPAN = (): TimeSpan => span(100, 200);

// Compact view of a result: [intervalId, start, end].
function bounds(intervals: Interval[]): [string, number, number | null][] {
  return intervals.map(interval => [
    interval.intervalId,
    interval.startTimeEpochMilliseconds,
    interval.endTimeEpochMilliseconds,
  ]);
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('B. getTrimmedIntervalsWithinTimeSpan in src/timeChart/useTimePortions.ts (criterion 1)', () => {
  it('B1: interval overlapping the span start is clipped to the span start; one overlapping the span end is clipped to the span end', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [iv('start', 'p', 50, 150), iv('end', 'p', 150, 250)],
      SPAN(),
    );
    expect(bounds(result)).toEqual([
      ['start', 100, 150],
      ['end', 150, 200],
    ]);
  });

  it('B2: interval inside the span is returned unchanged (same ids, start and end)', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [iv('inside', 'p', 120, 180)],
      SPAN(),
    );
    expect(result).toEqual([iv('inside', 'p', 120, 180)]);
  });

  // Expected to fail (Jest it.failing) until bug ticket ACTRA-2 is fixed: "Keep intervals that share a boundary with the time span instead of dropping them".
  // Remove the .failing mark once ACTRA-2 is fixed.
  it.failing(
    'B3: interval covering the whole span is returned as exactly the span bounds, including intervals that cover it and end exactly at the span end or start exactly at the span start',
    () => {
      const result = getTrimmedIntervalsWithinTimeSpan(
        [
          iv('covering', 'p', 50, 250),
          iv('covers-to-end', 'p', 50, 200),
          iv('from-start-covers', 'p', 100, 250),
        ],
        SPAN(),
      );
      expect(bounds(result)).toEqual([
        ['covering', 100, 200],
        ['covers-to-end', 100, 200],
        ['from-start-covers', 100, 200],
      ]);
    },
  );

  it('B4: intervals wholly before and wholly after the span are left out', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [iv('before', 'p', 10, 50), iv('after', 'p', 300, 400)],
      SPAN(),
    );
    expect(result).toEqual([]);
  });

  it('B5: interval ending exactly at the span start and interval starting exactly at the span end are left out (zero overlap)', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [iv('ends-at-start', 'p', 50, 100), iv('starts-at-end', 'p', 200, 300)],
      SPAN(),
    );
    expect(result).toEqual([]);
  });

  // Expected to fail (Jest it.failing) until bug ticket ACTRA-2 is fixed: "Keep intervals that share a boundary with the time span instead of dropping them".
  // Remove the .failing mark once ACTRA-2 is fixed.
  it.failing(
    'B6: intervals touching the boundary from inside, [100,150] and [150,200] in span [100,200], are kept in full',
    () => {
      const result = getTrimmedIntervalsWithinTimeSpan(
        [iv('from-start', 'p', 100, 150), iv('to-end', 'p', 150, 200)],
        SPAN(),
      );
      expect(bounds(result)).toEqual([
        ['from-start', 100, 150],
        ['to-end', 150, 200],
      ]);
    },
  );

  it('B7: interval identical to the span is kept in full', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [iv('same', 'p', 100, 200)],
      SPAN(),
    );
    expect(bounds(result)).toEqual([['same', 100, 200]]);
  });

  it('B8: running intervals and spans: a running interval started inside a closed span is clipped at the span end; a running interval in a running span counts up to now; a running interval started before a running span starts at the span start; a running interval starting after a closed span end is left out', () => {
    // Running interval started inside a closed span: clipped at the span end.
    const insideClosed = getTrimmedIntervalsWithinTimeSpan(
      [iv('run', 'p', 150, null)],
      SPAN(),
    );
    expect(bounds(insideClosed)).toEqual([['run', 150, 200]]);

    // Running interval in a running span: counts up to now (NOW).
    const runningSpan = getTrimmedIntervalsWithinTimeSpan(
      [iv('run-in-running', 'p', 150, null)],
      span(100, null),
    );
    expect(runningSpan).toHaveLength(1);
    const [clippedRunning] = runningSpan;
    expect(clippedRunning.startTimeEpochMilliseconds).toBe(150);
    expect(
      (clippedRunning.endTimeEpochMilliseconds ?? NOW) -
        clippedRunning.startTimeEpochMilliseconds,
    ).toBe(NOW - 150);

    // Running interval started before a running span: starts at the span start.
    const startsBefore = getTrimmedIntervalsWithinTimeSpan(
      [iv('run-before', 'p', 50, null)],
      span(100, null),
    );
    expect(startsBefore).toHaveLength(1);
    const [clippedBefore] = startsBefore;
    expect(clippedBefore.startTimeEpochMilliseconds).toBe(100);
    expect(
      (clippedBefore.endTimeEpochMilliseconds ?? NOW) -
        clippedBefore.startTimeEpochMilliseconds,
    ).toBe(NOW - 100);

    // Running interval starting after a closed span has ended: left out.
    const afterClosed = getTrimmedIntervalsWithinTimeSpan(
      [iv('run-after', 'p', 300, null)],
      SPAN(),
    );
    expect(afterClosed).toEqual([]);
  });

  it('B9: each returned interval keeps its intervalId and parentActivityId, and the input objects are not changed by the call', () => {
    const input = [iv('a', 'parent-1', 50, 150), iv('b', 'parent-2', 120, 180)];
    const snapshot = JSON.parse(JSON.stringify(input));

    const result = getTrimmedIntervalsWithinTimeSpan(input, SPAN());

    expect(result).toEqual([
      iv('a', 'parent-1', 100, 150),
      iv('b', 'parent-2', 120, 180),
    ]);
    expect(input).toEqual(snapshot);
  });

  it('B10: mixed list returns only the intervals with overlap, in input order', () => {
    const result = getTrimmedIntervalsWithinTimeSpan(
      [
        iv('out-before', 'p', 0, 50),
        iv('inside', 'p', 120, 180),
        iv('clipped-end', 'p', 150, 250),
        iv('out-after', 'p', 300, 400),
        iv('clipped-start', 'p', 190, 260),
      ],
      SPAN(),
    );
    expect(bounds(result)).toEqual([
      ['inside', 120, 180],
      ['clipped-end', 150, 200],
      ['clipped-start', 190, 200],
    ]);
  });

  it('B11: timeSpan null returns the input intervals unchanged (default argument; not a criterion)', () => {
    const input = [iv('a', 'p', 50, 150), iv('b', 'p', 300, 400)];
    expect(getTrimmedIntervalsWithinTimeSpan(input)).toEqual(input);
  });
});
