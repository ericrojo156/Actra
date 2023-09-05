import React, {useCallback, useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, LayoutAnimation} from 'react-native';
import {
  Activity,
  ActivityElement,
  ELEMENT_HEIGHT,
  STANDARD_ELEMENT_WIDTH,
} from '../components/ActivityElement';
import useActivities, {GetActivityById} from '../activity/useActivities';
import GradientBackground from './GradientBackground';

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

interface ActivitiesListProps {
  activities: Activity[];
  getActivityById: GetActivityById;
  width?: number;
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  const {getActivityById, activities, width = STANDARD_ELEMENT_WIDTH} = props;
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: string) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );

  useLayoutAnimation();
  return (
    <View style={styles.activitiesListContainer}>
      <FlatList
        data={activities}
        renderItem={({item}) => (
          <>
            <ActivityElement
              getActivityById={getActivityById}
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

function ActivitiesListScreen() {
  const {activities, getActivityById} = useActivities();
  return (
    <GradientBackground>
      <View style={{marginTop: '10%'}} />
      <ActivitiesList
        activities={activities}
        getActivityById={getActivityById}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '90%',
  },
});

export default React.memo(ActivitiesListScreen);
