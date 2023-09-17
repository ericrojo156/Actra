import React, {useMemo, useState, useCallback} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import ExpandedActivityElement, {Activity} from './ActivityElement';
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
  width?: number;
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  const {getActivity, activities, width = STANDARD_ELEMENT_WIDTH} = props;
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
  useLayoutAnimation();
  return (
    <View style={{...styles.activitiesListContainer}}>
      <FlatList
        data={activities}
        renderItem={({item}) => (
          <ExpandedActivityElement
            getActivity={getActivity}
            isExpanded={isExpanded(item.id)}
            setIsExpanded={setIsExpanded}
            {...item}
            width={width}
          />
        )}
        keyExtractor={item => item.id.toString()}
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
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '85%',
  },
});