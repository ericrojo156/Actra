import React, {useMemo, useState, useCallback} from 'react';
import {
  LayoutAnimation,
  View,
  FlatList,
  StyleSheet,
  DimensionValue,
} from 'react-native';
import {ExpandedActivityElement, Activity} from './ActivityElement';
import {GetActivity} from './useActivities';
import {STANDARD_ELEMENT_WIDTH, ELEMENT_HEIGHT} from '../constants';
import {IdType} from '../types';

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
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  useLayoutAnimation();
  const {
    getSubactivities,
    getActivity,
    activities,
    elementWidth = STANDARD_ELEMENT_WIDTH,
    listHeight = '100%',
    canAddSubactivities,
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
  const renderActivityElement = useCallback(
    ({item}: any) => (
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
  return (
    <View style={{...styles.activitiesListContainer, height: listHeight}}>
      <FlatList
        data={activities}
        renderItem={renderActivityElement}
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
