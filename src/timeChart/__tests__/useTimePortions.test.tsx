import React from 'react';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import {Activity} from '../../activity/ActivityElement';
import {Interval} from '../../interval/types';
import {STANDARD_TICK_MS} from '../../time/constants';
import {TimeSpan} from '../../time/types';
import {IdType} from '../../types';
import {UNTRACKED_ACTIVITY_ID, useTimePortions} from '../useTimePortions';

// Fixed clock: the hook reads Date.now() on every tick.
const NOW = 1_000_000_000;

// Fakes for the hooks the chart reads. Each is a stable function (not re-created per render),
// so the hook's effect is not re-subscribed on every render.
let mockActivities: Activity[] = [];
let mockIntervals: Interval[] = [];

const mockGetActivity = (id: IdType): Activity | null =>
  mockActivities.find(activity => activity.id === id) ?? null;

const mockTranslate = (phrase: string): string =>
  phrase === 'Untracked-Time'
    ? 'Untracked Time'
    : `untranslated key phrase: ${phrase}`;

jest.mock('../../activity/useActivities', () => ({
  __esModule: true,
  default: () => ({getActivity: mockGetActivity}),
}));

jest.mock('../../interval/useIntervals', () => ({
  useIntervals: () => ({intervals: mockIntervals}),
}));

jest.mock('../../internationalization/useTranslation', () => ({
  useTranslation: () => ({translate: mockTranslate}),
}));

function makeActivity(
  id: string,
  parentId: IdType = null,
  name: string = id,
): Activity {
  return {id, parentId, name, currentlyActiveIntervalId: null};
}

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

type HookResult = ReturnType<typeof useTimePortions>;

let latestResult: HookResult | null = null;

function Probe({timeSpan}: {timeSpan: TimeSpan}): null {
  latestResult = useTimePortions(timeSpan);
  return null;
}

const renderers: ReactTestRenderer[] = [];

function mountChart(timeSpan: TimeSpan): ReactTestRenderer {
  let renderer: ReactTestRenderer | null = null;
  act(() => {
    renderer = create(<Probe timeSpan={timeSpan} />);
  });
  if (renderer === null) {
    throw new Error('chart did not mount');
  }
  renderers.push(renderer);
  return renderer;
}

function unmountChart(renderer: ReactTestRenderer): void {
  act(() => {
    renderer.unmount();
  });
  renderers.splice(renderers.indexOf(renderer), 1);
}

function currentResult(): HookResult {
  if (latestResult === null) {
    throw new Error('chart has not rendered');
  }
  return latestResult;
}

// Advances the fake clock by one tick (STANDARD_TICK_MS by default) and returns the latest result.
function tickChart(ms: number = STANDARD_TICK_MS): HookResult {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
  return currentResult();
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
  mockActivities = [];
  mockIntervals = [];
  latestResult = null;
});

afterEach(() => {
  act(() => {
    renderers.splice(0).forEach(renderer => renderer.unmount());
  });
  jest.useRealTimers();
});

describe('C. slices via useTimePortions in src/timeChart/useTimePortions.ts (criteria 1 to 7)', () => {
  it('C1 (criterion 1): clipped bounds appear in trimmedIntervals; an interval outside the span creates no slice for its activity', () => {
    mockActivities = [makeActivity('A'), makeActivity('OUT')];
    mockIntervals = [
      iv('a1', 'A', 900, 1050),
      iv('a2', 'A', 1150, 1300),
      iv('o1', 'OUT', 1300, 1400),
    ];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;

    expect(portions.get('A')?.trimmedIntervals).toEqual([
      iv('a1', 'A', 1000, 1050),
      iv('a2', 'A', 1150, 1200),
    ]);
    expect(portions.has('OUT')).toBe(false);
  });

  it('C2 (criterion 1): a running interval in a running span counts up to now: its duration is now minus its start, and the percent grows as the clock advances', () => {
    mockActivities = [makeActivity('A')];
    mockIntervals = [iv('run', 'A', NOW - 400, null)];
    mountChart(span(NOW - 1000, null));

    // One tick after mounting, now is NOW + 100: the interval lasts 500 of a 1100 span.
    const first = tickChart().timePortions.get('A')?.percent;
    expect(first).toBeCloseTo((500 / 1100) * 100);

    // Two ticks after mounting, now is NOW + 200: 600 of 1200.
    const second = tickChart().timePortions.get('A')?.percent;
    expect(second).toBeCloseTo((600 / 1200) * 100);
    expect(second).toBeGreaterThan(first ?? Number.POSITIVE_INFINITY);
  });

  it('C3 (criterion 2): subactivity time is not added to the parent slice; a parent with no intervals of its own gets no share of its subactivity time', () => {
    mockActivities = [
      makeActivity('P'),
      makeActivity('S', 'P'),
      makeActivity('Q'),
      makeActivity('R', 'Q'),
    ];
    mockIntervals = [
      iv('p1', 'P', 1010, 1030), // 20 of 200 for P
      iv('s1', 'S', 1040, 1100), // 60 of 200 for S, a subactivity of P
      iv('r1', 'R', 1120, 1150), // 30 of 200 for R, a subactivity of Q
    ];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;

    expect(portions.get('P')?.percent).toBeCloseTo(10);
    expect(portions.get('P')?.trimmedIntervals).toEqual([
      iv('p1', 'P', 1010, 1030),
    ]);
    expect(portions.get('S')?.percent).toBeCloseTo(30);
    expect(portions.get('Q')?.percent ?? 0).toBeCloseTo(0);
    expect(portions.get('R')?.percent).toBeCloseTo(15);
  });

  it('C4 (criterion 3): intervals of a deleted activity are left out; their time counts as untracked', () => {
    // 'gone' has intervals in the span but no activity exists for it.
    mockActivities = [makeActivity('A')];
    mockIntervals = [iv('a1', 'A', 1020, 1040), iv('g1', 'gone', 1100, 1130)];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;

    expect(portions.has('gone')).toBe(false);
    expect(portions.get('A')?.percent).toBeCloseTo(10);
    expect(portions.get(UNTRACKED_ACTIVITY_ID)?.percent).toBeCloseTo(90);
  });

  it('C5 (criterion 4): percent is clipped time divided by span length, for two intervals of one activity and for an interval clipped by the span', () => {
    mockActivities = [makeActivity('A'), makeActivity('B')];
    mockIntervals = [
      iv('a1', 'A', 1020, 1040), // 20
      iv('a2', 'A', 1100, 1130), // 30; A is 50 of 200 = 25%
      iv('b1', 'B', 1170, 1300), // clipped to [1170,1200] = 30 of 200 = 15%, not 130
    ];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;

    expect(portions.get('A')?.percent).toBeCloseTo(25);
    expect(portions.get('B')?.percent).toBeCloseTo(15);
    expect(portions.get(UNTRACKED_ACTIVITY_ID)?.percent).toBeCloseTo(60);
  });

  it('C6 (criterion 4): totalTimeMilliseconds equals the span length for a closed span and for a running span, on the result and on each slice', () => {
    mockActivities = [makeActivity('A')];
    mockIntervals = [iv('a1', 'A', 1020, 1040)];
    const closed = mountChart(span(1000, 1200));

    const closedResult = tickChart();
    expect(closedResult.totalTimeMilliseconds).toBe(200);
    expect(closedResult.timePortions.get('A')?.totalTimeMilliseconds).toBe(200);
    expect(
      closedResult.timePortions.get(UNTRACKED_ACTIVITY_ID)
        ?.totalTimeMilliseconds,
    ).toBe(200);
    unmountChart(closed);

    // Running span starting 500 ms before the moment it is mounted; after one tick the span is 600 long.
    const mountedAt = Date.now();
    mockIntervals = [iv('r1', 'A', mountedAt - 300, null)];
    mountChart(span(mountedAt - 500, null));

    const runningResult = tickChart();
    expect(runningResult.totalTimeMilliseconds).toBe(600);
    expect(runningResult.timePortions.get('A')?.totalTimeMilliseconds).toBe(
      600,
    );
    expect(
      runningResult.timePortions.get(UNTRACKED_ACTIVITY_ID)
        ?.totalTimeMilliseconds,
    ).toBe(600);
  });

  it('C7 (criterion 5): Untracked Time is the last entry, keyed UNTRACKED_ACTIVITY_ID, grey, with percent 100 minus the sum of the other percents', () => {
    mockActivities = [makeActivity('A'), makeActivity('B')];
    mockIntervals = [
      iv('a1', 'A', 1020, 1040),
      iv('a2', 'A', 1100, 1130),
      iv('b1', 'B', 1170, 1300), // clipped to 30
    ];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;
    const keys = [...portions.keys()];
    const untracked = portions.get(UNTRACKED_ACTIVITY_ID);

    expect(keys[keys.length - 1]).toBe(UNTRACKED_ACTIVITY_ID);
    expect(untracked?.activity.name).toBe('Untracked Time');

    // Grey: the three colour channels are equal.
    const color = untracked?.activity.color;
    expect(color?.red).toBeDefined();
    expect(color?.green).toBe(color?.red);
    expect(color?.blue).toBe(color?.red);

    // 100 - 25 (A) - 15 (B) = 60
    expect(untracked?.percent).toBeCloseTo(60);
  });

  it('C8 (criterion 5): activities that fill the span exactly still leave Untracked Time present, last, with percent 0', () => {
    mockActivities = [makeActivity('A'), makeActivity('B')];
    mockIntervals = [
      iv('a1', 'A', 950, 1100), // clipped to [1000,1100] = 100 of 200
      iv('b1', 'B', 1100, 1300), // clipped to [1100,1200] = 100 of 200
    ];
    mountChart(span(1000, 1200));

    const portions = tickChart().timePortions;
    const keys = [...portions.keys()];

    expect(portions.get('A')?.percent).toBeCloseTo(50);
    expect(portions.get('B')?.percent).toBeCloseTo(50);
    expect(keys[keys.length - 1]).toBe(UNTRACKED_ACTIVITY_ID);
    expect(portions.get(UNTRACKED_ACTIVITY_ID)?.percent).toBeCloseTo(0);
  });

  it('C9 (criterion 6): slices follow the order their first interval is met in the intervals array, not size; reversing the array reverses the order', () => {
    mockActivities = [makeActivity('A'), makeActivity('B'), makeActivity('C')];
    const b1 = iv('b1', 'B', 1010, 1015); // small, first met
    const a1 = iv('a1', 'A', 1020, 1080); // largest
    const b2 = iv('b2', 'B', 1085, 1090);
    const c1 = iv('c1', 'C', 1091, 1095);

    mockIntervals = [b1, a1, b2, c1];
    mountChart(span(1000, 1200));
    expect([...tickChart().timePortions.keys()]).toEqual([
      'B',
      'A',
      'C',
      UNTRACKED_ACTIVITY_ID,
    ]);

    unmountChart(renderers[0]);
    mockIntervals = [c1, b2, a1, b1];
    mountChart(span(1000, 1200));
    expect([...tickChart().timePortions.keys()]).toEqual([
      'C',
      'B',
      'A',
      UNTRACKED_ACTIVITY_ID,
    ]);
  });

  it('C10 (criterion 7): with no intervals in the span, after one tick the map holds exactly one entry, Untracked Time at 100 percent, with no trimmed intervals', () => {
    mockActivities = [makeActivity('A')];

    // No intervals at all.
    mockIntervals = [];
    const empty = mountChart(span(1000, 1200));
    const noIntervals = tickChart().timePortions;
    expect([...noIntervals.keys()]).toEqual([UNTRACKED_ACTIVITY_ID]);
    expect(noIntervals.get(UNTRACKED_ACTIVITY_ID)?.percent).toBeCloseTo(100);
    expect(noIntervals.get(UNTRACKED_ACTIVITY_ID)?.trimmedIntervals).toEqual(
      [],
    );
    unmountChart(empty);

    // Intervals that all lie outside the span.
    mockIntervals = [iv('o1', 'A', 0, 500), iv('o2', 'A', 1300, 1400)];
    mountChart(span(1000, 1200));
    const outside = tickChart().timePortions;
    expect([...outside.keys()]).toEqual([UNTRACKED_ACTIVITY_ID]);
    expect(outside.get(UNTRACKED_ACTIVITY_ID)?.percent).toBeCloseTo(100);
    expect(outside.get(UNTRACKED_ACTIVITY_ID)?.trimmedIntervals).toEqual([]);
  });
});
