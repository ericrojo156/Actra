import React from 'react';
import {View} from 'react-native';
import GradientBackground from './GradientBackground';
import {useIntervals} from '../interval/useIntervals';
import {IdProp, NavigationScreenProps} from '../types';
import {IntervalsList} from '../interval/IntervalsList';

function History(props: NavigationScreenProps<IdProp>) {
  const {id: parentActivityId} = props.route.params;
  const {intervals} = useIntervals(parentActivityId);
  return (
    <GradientBackground>
      <View style={{paddingTop: 90, paddingBottom: 30}}>
        <IntervalsList
          parentActivityId={parentActivityId}
          intervals={intervals}
        />
      </View>
    </GradientBackground>
  );
}

export default React.memo(History);
