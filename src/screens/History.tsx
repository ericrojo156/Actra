import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import GradientBackground from './GradientBackground';
import {IdType, NavigationScreenProps} from '../types';
import {IntervalsList} from '../interval/IntervalsList';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';
import {TimeSpan} from '../time/types';
import {TimeDisplay} from '../time/TimeDisplay';
import {Interval} from '../interval/types';
import {getDuration} from '../time/utils';
import {useRealTimeDuration} from '../time/useRealTimeDuration';
import {useIntervals} from '../interval/useIntervals';
import {getTrimmedIntervalsWithinTimeSpan} from '../timeChart/useTimePortions';
import {reverseArray} from '../utils/array';

const getTotalAccumulatedTimeMs = (intervals: Interval[]) => {
  const totalDuration = intervals.reduce(
    (acc: number, curr: Interval) => acc + getDuration(curr),
    0,
  );
  const totalDurationTimeSpan: TimeSpan = {
    startTimeEpochMilliseconds: Date.now() - totalDuration,
    endTimeEpochMilliseconds: null,
  };
  return totalDurationTimeSpan;
};

const HistoryTimeDisplay = React.memo((props: {intervals: Interval[]}) => {
  const {intervals} = props;
  const totalAccumulatedTimeMs = useRealTimeDuration(
    getTotalAccumulatedTimeMs(intervals),
  );
  const totalAccumulatedTimeMinutes =
    Math.floor(totalAccumulatedTimeMs / (1000 * 60)) * 1000 * 60;
  return <TimeDisplay milliseconds={totalAccumulatedTimeMinutes} />;
});

function History(
  props: NavigationScreenProps<{id: IdType; timeSpan: TimeSpan | null}>,
) {
  const {id: parentActivityId, timeSpan} = props.route.params;
  const {intervals: unsortedIntervals} = useIntervals(parentActivityId);
  const intervalsSortedNewestFirst = useMemo(
    () =>
      reverseArray(
        getTrimmedIntervalsWithinTimeSpan(unsortedIntervals, timeSpan),
      ),
    [timeSpan, unsortedIntervals],
  );
  const {translate} = useTranslation();
  const historyLabel = translate('History');
  const name = useSelector(
    (state: ApplicationState) =>
      state.activity.activities.getData(parentActivityId)?.name,
  );
  return (
    <GradientBackground>
      <View style={{paddingTop: 90, paddingBottom: 30}}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{...commonStyles.textStyle, fontSize: 25}}>{name}</Text>
          <Text style={{...commonStyles.textStyle, fontSize: 25}}>
            {historyLabel}
          </Text>
        </View>
        <HistoryTimeDisplay intervals={unsortedIntervals} />
        <IntervalsList
          parentActivityId={parentActivityId}
          intervals={intervalsSortedNewestFirst}
        />
      </View>
    </GradientBackground>
  );
}

export default React.memo(History);
