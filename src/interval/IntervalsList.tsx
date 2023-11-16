import React, {useCallback, useMemo} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import {STANDARD_ELEMENT_HEIGHT} from '../constants';
import IntervalElement from './IntervalElement';
import {IdType} from '../types';
import {PanGestureRecognizer} from '../components/PanGestureRecognizer';
import {useDispatch} from 'react-redux';
import intervalsActions from './redux/intervalsActions';
import {usePressingMutex} from '../activity/hooks/usePressingMutex';
import {useTranslation} from '../internationalization/useTranslation';
import {feedbackMessageInvoked} from '../feedback/FeedbackActions';
import {Interval} from './types';

type ListItemProps = {item: Interval};

export const SPACE_BETWEEN_ELEMENTS = 5;
const SWIPE_LEFT_THRESHOLD = -50;

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
      length: STANDARD_ELEMENT_HEIGHT,
      offset: STANDARD_ELEMENT_HEIGHT * index,
      index,
    }),
    [],
  );
  const dispatch = useDispatch();
  const {translate} = useTranslation();
  const onSwipeLeft = useCallback(
    (id: IdType): void => {
      const intervalToDelete =
        intervals.find(interval => interval.intervalId === id) ?? null;
      if (!intervalToDelete) {
        return;
      }
      const wasActive = intervalToDelete.endTimeEpochMilliseconds === null;
      dispatch(
        intervalsActions.deleteInterval.request(intervalToDelete, wasActive),
      );
      dispatch(
        feedbackMessageInvoked({
          feedbackType: 'info',
          message: translate('Deleted-Interval'),
          secondaryMessage: translate('Press-Here-To-Undo'),
          undoAction: intervalsActions.undoDeleteInterval.request(
            intervalToDelete,
            wasActive,
          ),
        }),
      );
    },
    [dispatch, intervals, translate],
  );
  const {currentlyPressingIdRef, setCurrentlyPressingId} = usePressingMutex();
  const LeftSwipeableElement = useCallback(
    ({item}: ListItemProps) => (
      <PanGestureRecognizer
        currentlyPressingIdRef={currentlyPressingIdRef}
        shouldUsePositionFromPan={true}
        thresholdDx={SWIPE_LEFT_THRESHOLD}
        onSwipeLeft={() => onSwipeLeft(item.intervalId)}>
        <IntervalElement
          setCurrentlyPressingId={setCurrentlyPressingId}
          intervalId={item.intervalId}
          parentActivityId={parentActivityId ?? ''}
        />
      </PanGestureRecognizer>
    ),
    [
      currentlyPressingIdRef,
      onSwipeLeft,
      parentActivityId,
      setCurrentlyPressingId,
    ],
  );
  return (
    <View style={{...styles.intervalsListContainer}}>
      <FlatList
        data={intervals}
        renderItem={({item}) => <LeftSwipeableElement item={item} />}
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
    height: 600,
  },
});
