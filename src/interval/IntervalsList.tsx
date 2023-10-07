import React, {useCallback, useMemo} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import {ELEMENT_HEIGHT} from '../constants';
import IntervalElement, {Interval} from './IntervalElement';
import {IdType} from '../types';

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
  parentActivityId: IdType;
  intervals: Interval[];
  customStyle?: any;
  width?: number;
}

export const IntervalsList = React.memo((props: IntervalsListProps) => {
  const {intervals, parentActivityId} = props;
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
            parentActivityId={parentActivityId ?? ''}
          />
        )}
        keyExtractor={item => item.intervalId ?? ''}
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
