import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import GradientBackground from './GradientBackground';
import {useIntervals} from '../interval/useIntervals';
import {IdProp, NavigationScreenProps} from '../types';
import {IntervalsList} from '../interval/IntervalsList';
import {reverseArray} from '../utils/array';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';

function History(props: NavigationScreenProps<IdProp>) {
  const {id: parentActivityId} = props.route.params;
  const {translate} = useTranslation();
  const historyLabel = translate('History');
  const name = useSelector(
    (state: ApplicationState) =>
      state.activity.activities.getData(parentActivityId)?.name,
  );
  const {intervals} = useIntervals(parentActivityId);
  const intervalsSortedNewestFirst = useMemo(
    () => reverseArray(intervals),
    [intervals],
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
        <IntervalsList
          parentActivityId={parentActivityId}
          intervals={intervalsSortedNewestFirst}
        />
      </View>
    </GradientBackground>
  );
}

export default React.memo(History);
