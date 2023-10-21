import React, {useMemo, useState, useCallback} from 'react';
import {
  LayoutAnimation,
  View,
  FlatList,
  StyleSheet,
  DimensionValue,
} from 'react-native';
import {
  ExpandableActivityElement,
  Activity,
  ActivityElementProps,
} from './ActivityElement';
import {GetActivity} from './useActivities';
import {STANDARD_ELEMENT_WIDTH, ELEMENT_HEIGHT} from '../constants';
import {IdType} from '../types';
import {PanGestureRecognizer} from '../components/PanGestureRecognizer';
import {usePressingMutex} from './hooks/usePressingMutex';

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

interface ActivitiesListProps {
  activities: Activity[];
  getSubactivities: (id: IdType) => Activity[];
  getActivity: GetActivity;
  customStyle?: any;
  listHeight?: DimensionValue;
  elementWidth?: number;
  canAddSubactivities: (id: IdType) => boolean;
  onSwipeLeft?: (id: IdType) => void;
}

type ListItemProps = {item: ActivityElementProps};

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  useLayoutAnimation();
  const {
    getSubactivities,
    getActivity,
    activities,
    elementWidth = STANDARD_ELEMENT_WIDTH,
    listHeight = '100%',
    canAddSubactivities,
    onSwipeLeft,
  } = props;
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: IdType) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );
  const setIsExpanded = useCallback(
    (shouldExpand: boolean, id: IdType) => {
      setCurrentlyExpandedActivity(shouldExpand ? id : null);
    },
    [setCurrentlyExpandedActivity],
  );
  const ActivityListElement = useCallback(
    ({item}: ListItemProps) => (
      <ExpandableActivityElement
        getSubactivities={getSubactivities}
        getActivity={getActivity}
        isExpanded={isExpanded(item.id)}
        setIsExpanded={setIsExpanded}
        canAddSubactivities={canAddSubactivities}
        {...item}
        width={elementWidth}
      />
    ),
    [
      canAddSubactivities,
      elementWidth,
      getActivity,
      getSubactivities,
      isExpanded,
      setIsExpanded,
    ],
  );
  const {currentlyPressingIdRef, setCurrentlyPressingId} = usePressingMutex();
  const LeftSwipeableElement = useCallback(
    ({item}: ListItemProps) => (
      <PanGestureRecognizer
        currentlyPressingIdRef={currentlyPressingIdRef}
        shouldUsePositionFromPan={true}
        thresholdDx={SWIPE_LEFT_THRESHOLD}
        onSwipeLeft={() => onSwipeLeft?.(item.id)}>
        <ActivityListElement item={{...item, setCurrentlyPressingId}} />
      </PanGestureRecognizer>
    ),
    [
      ActivityListElement,
      currentlyPressingIdRef,
      onSwipeLeft,
      setCurrentlyPressingId,
    ],
  );
  return (
    <View style={{...styles.activitiesListContainer, height: listHeight}}>
      <FlatList
        data={activities}
        renderItem={onSwipeLeft ? LeftSwipeableElement : ActivityListElement}
        keyExtractor={item => item.id?.toString() ?? ''}
        initialNumToRender={20}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: STANDARD_ELEMENT_WIDTH,
          offset: ELEMENT_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});
