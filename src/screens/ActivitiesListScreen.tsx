import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Activity, ActivityElement} from '../components/ActivityElement';
import useActivities from '../activity/useActivities';

export function ActivitiesListScreen() {
  const activities: Activity[] = useActivities();
  return (
    <View style={styles.activitiesListContainer}>
      <FlatList
        data={activities}
        renderItem={ActivityElement}
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
