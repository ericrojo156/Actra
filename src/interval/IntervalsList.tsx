import React, {useCallback, useMemo} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import {ELEMENT_HEIGHT} from '../constants';
import {useIntervals} from './useIntervals';
import IntervalElement, {Interval} from './IntervalElement';

export const SPACE_BETWEEN_ELEMENTS = 5;

function useLayoutAnimation() {
  const layoutAnimConfig = useMemo(
    () => ({
      duration: 100,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    }),
    [],
  );
  LayoutAnimation.configureNext(layoutAnimConfig);
}

interface IntervalsListProps {
  parentActivityId: string;
  intervals: Interval[];
  customStyle?: any;
  width?: number;
}

export const IntervalsList = React.memo((props: IntervalsListProps) => {
  const {parentActivityId} = props;
  const {intervals} = useIntervals(parentActivityId);
  useLayoutAnimation();
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: ELEMENT_HEIGHT,
      offset: ELEMENT_HEIGHT * index,
      index,
    }),
    [],
  );
  return (
    <View style={{...styles.intervalsListContainer}}>
      <FlatList
        data={intervals}
        renderItem={({item}) => (
          <IntervalElement
            intervalId={item.intervalId}
            parentActivityId={parentActivityId}
          />
        )}
        keyExtractor={item => item.intervalId.toString()}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={getItemLayout}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  intervalsListContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});