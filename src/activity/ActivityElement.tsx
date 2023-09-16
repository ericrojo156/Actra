import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import * as ColorPalette from '../ColorPalette';
import CustomPressable from '../components/Pressable';
import DeleteOption from './optionsMenu/DeleteOption';
import EditOption from './optionsMenu/EditOption';
import HistoryOption from './optionsMenu/HistoryOption';
import JoinOption from './optionsMenu/JoinOption';
import useActivityOptionCallbacks from './useActivityOptionsActions';
import {commonStyles} from '../commonStyles';
import PressableIcon, {
  ACTRA_FUNCTION_OPTION_ICON_SIZE,
} from '../components/PressableIcon';
import {IdProp} from '../types';
import * as ColorProcessor from '../ColorProcessor';
import {useTranslation} from '../internationalization/useTranslation';
import {ActivitiesList} from './ActivitiesList';
import {
  STANDARD_ELEMENT_WIDTH,
  SUBACTIVITY_LEVEL_WIDTH_DECREMENT,
  ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
} from '../constants';

export interface Activity {
  id: string;
  name: string;
  color?: ColorPalette.Color;
  subactivitiesIds: string[];
  intervalsIds: string[];
  currentlyActiveIntervalId: string | null;
}

export interface ActivityElementProps extends Activity {
  width?: number;
  getActivity: (id: string) => Activity | null;
}

export interface ExpandableActivityProps extends ActivityElementProps {
  isExpanded: boolean;
  setIsExpanded: (shouldExpand: boolean, id: string) => void;
}

function ActivityOptionsMenuBar(props: ExpandableActivityProps) {
  const {id, width} = props;
  const {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
  } = useActivityOptionCallbacks();
  return (
    <View
      style={{
        ...commonStyles.container,
        ...styles.activityOptionsMenuBar,
        width,
      }}>
      <DeleteOption onPress={() => onDeleteActivityOption(id)} />
      <JoinOption onPress={() => onJoinActivityOption(id)} />
      <EditOption onPress={() => onEditActivityOption(id)} />
      <HistoryOption onPress={() => onHistoryActivityOption(id)} />
    </View>
  );
}

interface AddSubactivityProps extends IdProp {
  id: string;
  width?: number;
}

function AddSubactivityOption(props: AddSubactivityProps) {
  const {id, width = STANDARD_ELEMENT_WIDTH} = props;
  const {onAddSubactivityOption} = useActivityOptionCallbacks();
  const {translate} = useTranslation();
  return (
    <PressableIcon
      label={translate('Add-Subactivity')}
      iconName="plus"
      style={{
        ...commonStyles.roundedElementBorder,
        ...styles.addSubactivityOptionContainer,
        ...styles.activityElement,
        width: width - SUBACTIVITY_LEVEL_WIDTH_DECREMENT,
      }}
      onPress={() => onAddSubactivityOption(id)}
    />
  );
}

function ExpandedSection(props: ExpandableActivityProps) {
  const {
    id,
    subactivitiesIds,
    getActivity,
    width = STANDARD_ELEMENT_WIDTH,
  } = props;
  const subactivities: Activity[] = useMemo(() => {
    return subactivitiesIds
      .map(getActivity)
      .filter(result => result !== null) as Activity[];
  }, [subactivitiesIds, getActivity]);
  return (
    <CustomPressable
      style={{...commonStyles.container, ...styles.expandedSection}}>
      <ActivityOptionsMenuBar {...props} />
      <View
        style={{
          ...commonStyles.container,
          transform: [{translateY: -30}],
        }}>
        {subactivities.length > 0 && (
          <>
            <ActivitiesList
              getActivity={getActivity}
              activities={subactivities}
              width={width - SUBACTIVITY_LEVEL_WIDTH_DECREMENT}
            />
            <View style={{marginBottom: SPACE_BETWEEN_ELEMENTS * 6}} />
          </>
        )}
      </View>
      <AddSubactivityOption id={id} width={width} />
    </CustomPressable>
  );
}

export function ActivityElement(props: ActivityElementProps) {
  const {name, width, color} = props;
  let activityStyle: StyleProp<ViewStyle> = {
    ...commonStyles.container,
    ...styles.activityElement,
    width,
  };
  if (color) {
    activityStyle = {
      ...activityStyle,
      backgroundColor: ColorProcessor.serialize(color),
    };
  }
  return (
    <View style={activityStyle}>
      <Text style={{...commonStyles.textStyle, ...styles.textStyle}}>
        {name}
      </Text>
    </View>
  );
}

function ExpandedActivityElement(props: ExpandableActivityProps) {
  const {
    id,
    isExpanded,
    setIsExpanded,
    width = STANDARD_ELEMENT_WIDTH,
    color,
  } = props;
  const activityProps = {
    ...props,
    color: undefined,
  };
  return (
    <View style={{padding: SPACE_BETWEEN_ELEMENTS / 2}}>
      <CustomPressable
        onPress={() => setIsExpanded(!isExpanded, id)}
        style={{
          ...commonStyles.roundedElementBorder,
          ...styles.expandableActivityElement,
          width,
          backgroundColor: ColorProcessor.serialize(color),
        }}>
        <ActivityElement {...activityProps} />
        <>{isExpanded && <ExpandedSection {...props} />}</>
      </CustomPressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  expandableActivityElement: {
    backgroundColor: ColorPalette.activityDefaultColor_RGBSerialized,
  },
  activityElement: {
    width: STANDARD_ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
  },
  textStyle: {
    fontSize: 20,
  },
  expandedSection: {
    paddingBottom: 10,
  },
  activityOptionsMenuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: ACTRA_FUNCTION_OPTION_ICON_SIZE * 2,
    width: STANDARD_ELEMENT_WIDTH,
  },
  addSubactivityOptionContainer: {
    borderColor: ColorPalette.OffWhite_RGBSerialized,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

export default React.memo(ExpandedActivityElement);
