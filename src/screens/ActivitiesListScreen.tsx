import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {uuidv4} from '../utils/uuid';
import {Activity, ActivityElement} from '../components/ActivityElement';

export function ActivitiesListScreen() {
  const data: Activity[] = useMemo(
    () =>
      Array.from({length: 100}, (_, index) => ({
        id: uuidv4(),
        name: `Item ${index}`,
      })),
    [],
  );

  return (
    <View style={styles.activitiesListContainer}>
      <FlatList
        data={data}
        renderItem={ActivityElement}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={10} // Number of items to render initially
        windowSize={5} // Number of items to keep in memory around the currently visible area
        getItemLayout={(data, index) => ({
          length: 100, // Height of each item
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
