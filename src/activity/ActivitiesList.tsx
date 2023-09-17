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
  getActivity: GetActivity;
  customStyle?: any;
  listHeight?: DimensionValue;
  elementWidth?: number;
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  useLayoutAnimation();
  const {
    getActivity,
    activities,
    elementWidth = STANDARD_ELEMENT_WIDTH,
    listHeight = '100%',
  } = props;
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: string) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );
  const setIsExpanded = useCallback(
    (shouldExpand: boolean, id: string) => {
      setCurrentlyExpandedActivity(shouldExpand ? id : null);
    },
    [setCurrentlyExpandedActivity],
  );
  const renderItem = useCallback(
    ({item}: any) => (
      <ExpandedActivityElement
        getActivity={getActivity}
        isExpanded={isExpanded(item.id)}
        setIsExpanded={setIsExpanded}
        {...item}
        width={elementWidth}
      />
    ),
    [elementWidth, getActivity, isExpanded, setIsExpanded],
  );
  return (
    <View style={{...styles.activitiesListContainer, height: listHeight}}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
