import React, {useMemo, useState, useCallback, useRef} from 'react';
import {
  LayoutAnimation,
  View,
  FlatList,
  StyleSheet,
  DimensionValue,
  Animated,
} from 'react-native';
import {ExpandedActivityElement, Activity} from './ActivityElement';
import {GetActivity} from './useActivities';
import {STANDARD_ELEMENT_WIDTH, ELEMENT_HEIGHT} from '../constants';
import {IdType} from '../types';
import {PanGestureRecognizer} from '../components/PanGestureRecognizer';

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

type ListItemProps = any;

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
      <ExpandedActivityElement
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
  const pan = useRef(new Animated.ValueXY()).current;
  const LeftSwipeableElement = useCallback(
    (listItemProps: ListItemProps) => (
      <PanGestureRecognizer
        pan={pan}
        shouldUsePositionFromPan={false}
        thresholdDx={SWIPE_LEFT_THRESHOLD}
        onSwipeLeft={() => onSwipeLeft?.(listItemProps.item.id)}>
        <ActivityListElement {...listItemProps} />
      </PanGestureRecognizer>
    ),
    [ActivityListElement, onSwipeLeft, pan],
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
