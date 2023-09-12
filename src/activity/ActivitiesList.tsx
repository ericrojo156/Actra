import React, {useMemo, useState, useCallback} from 'react';
import {LayoutAnimation, View, FlatList, StyleSheet} from 'react-native';
import {Activity, ExpandedActivityElement} from './ActivityElement';
import {GetActivity} from './useActivities';
import {
  STANDARD_ELEMENT_WIDTH,
  ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
} from '../constants';

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
  useLayoutAnimation();
  return (
    <View style={{...styles.activitiesListContainer}}>
      <FlatList
        data={activities}
        renderItem={({item}) => (
          <>
            <ExpandedActivityElement
              getActivity={getActivity}
              isExpanded={isExpanded}
              setIsExpanded={(shouldExpand: boolean) => {
                setCurrentlyExpandedActivity(shouldExpand ? item.id : null);
              }}
              {...item}
              width={width}
            />
            <View style={{marginTop: SPACE_BETWEEN_ELEMENTS}} />
          </>
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
