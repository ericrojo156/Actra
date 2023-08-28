import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as ColorPalette from '../ColorPalette';
export interface Activity {
  id: string;
  name: string;
}

export function ActivityElement({item: activity}: {item: Activity}) {
  return (
    <View style={styles.activityElement}>
      <Text style={styles.textStyle}>{activity.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  activityElement: {
    marginTop: 5,
    backgroundColor: ColorPalette.activityDefaultColor_RGBSerialized,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorPalette.SoftBlack_RGBASerialized,
    width: 350,
    height: 50,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  textStyle: {
    fontSize: 17,
    color: ColorPalette.OffWhite_RGBSerialized,
  },
});
