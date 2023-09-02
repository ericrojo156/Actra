import React, {useCallback, useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, LayoutAnimation} from 'react-native';
import {Activity, ActivityElement} from '../components/ActivityElement';
import useActivities from '../activity/useActivities';

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

export function ActivitiesListScreen() {
  const activities: Activity[] = useActivities();
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
          <ActivityElement
            isExpanded={isExpanded(item.id)}
            setIsExpanded={(shouldExpand: boolean) =>
              setCurrentlyExpandedActivity(shouldExpand ? item.id : null)
            }
            {...item}
          />
        )}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 50 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10%',
    height: '90%',
  },
});
