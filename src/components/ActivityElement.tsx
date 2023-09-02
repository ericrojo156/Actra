import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as ColorPalette from '../ColorPalette';
import CustomPressable from './Pressable';
import DeleteOption from './optionsMenu/DeleteOption';
import EditOption from './optionsMenu/EditOption';
import HistoryOption from './optionsMenu/HistoryOption';
import JoinOption from './optionsMenu/JoinOption';

const ELEMENT_HEIGHT = 70;
const ELEMENT_WIDTH = 350;

export interface Activity {
  id: string;
  name: string;
  subactivitiesIds: string[];
  intervalsIds: string[];
  currentlyActiveIntervalId: string | null;
}

export interface ExpandableActivityProps extends Activity {
  isExpanded: boolean;
  setIsExpanded: (shouldExpand: boolean) => void;
}

function ActivityOptionsMenuBar(_props: Activity) {
  return (
    <View style={{...styles.container, ...styles.activityOptionsMenuBar}}>
      <DeleteOption />
      <JoinOption />
      <EditOption />
      <HistoryOption />
    </View>
  );
}

function ExpandedSection(props: Activity) {
  const {subactivitiesIds} = props;
  return (
    <View style={styles.expandedSection}>
      <ActivityOptionsMenuBar {...props} />
      {subactivitiesIds}
    </View>
  );
}

export function ActivityElement(props: ExpandableActivityProps) {
  const {name, isExpanded, setIsExpanded} = props;
  return (
    <View style={styles.activityElementContainer}>
      <CustomPressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{...styles.container, ...styles.activityElement}}>
        <Text style={styles.textStyle}>{name}</Text>
      </CustomPressable>
      {isExpanded && <ExpandedSection {...props} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityElementContainer: {
    borderWidth: 1,
    borderColor: ColorPalette.SoftBlack_RGBASerialized,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: ColorPalette.activityDefaultColor_RGBSerialized,
  },
  activityElement: {
    width: ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
  },
  textStyle: {
    fontSize: 20,
    color: ColorPalette.OffWhite_RGBSerialized,
  },
  expandedSection: {
    height: 100,
  },
  activityOptionsMenuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: ELEMENT_WIDTH,
  },
});
