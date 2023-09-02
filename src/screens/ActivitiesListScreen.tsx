import React, {useCallback, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Activity, ActivityElement} from '../components/ActivityElement';
import useActivities from '../activity/useActivities';

export function ActivitiesListScreen() {
  const activities: Activity[] = useActivities();
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: string) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );
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
