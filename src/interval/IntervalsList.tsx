import React, {useMemo} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import {STANDARD_ELEMENT_WIDTH, ELEMENT_HEIGHT} from '../constants';
import {useIntervals} from './useIntervals';
import {Interval, IntervalElement} from './IntervalElement';

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
  return (
    <View style={{...styles.intervalsListContainer}}>
      <FlatList
        data={intervals}
        renderItem={({item}) => (
          <>
            <IntervalElement
              intervalId={item.intervalId}
              parentActivityId={parentActivityId}
            />
            <View
              style={{
                marginTop: SPACE_BETWEEN_ELEMENTS,
                width: STANDARD_ELEMENT_WIDTH,
              }}
            />
          </>
        )}
        keyExtractor={item => item.intervalId.toString()}
        initialNumToRender={20}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: ELEMENT_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  intervalsListContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '85%',
  },
});
