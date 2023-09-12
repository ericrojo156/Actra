import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';
import GradientBackground from './GradientBackground';
import {useIntervals} from '../interval/useIntervals';
import {IdProp, NavigationScreenProps} from '../types';
import {SPACE_BETWEEN_ELEMENTS} from '../constants';
import {IntervalsList} from '../interval/IntervalsList';

function History(props: NavigationScreenProps<IdProp>) {
  const {id: parentActivityId} = props.route.params;
  const {intervals} = useIntervals(parentActivityId);
  const {translate} = useTranslation();
  const headerText = translate('History');
  return (
    <GradientBackground>
      <View style={{marginTop: '10%'}} />
      <Text
        style={{
          ...commonStyles.headerTextStyle,
        }}>
        {headerText}
      </Text>
      <View style={{marginBottom: SPACE_BETWEEN_ELEMENTS}} />
      <IntervalsList
        parentActivityId={parentActivityId}
        intervals={intervals}
      />
      <View style={{marginBottom: 40}} />
    </GradientBackground>
  );
}

export default React.memo(History);
