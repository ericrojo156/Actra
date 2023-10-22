import React, {useCallback, useMemo} from 'react';
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
import {IdProp, IdType} from '../types';
import * as ColorProcessor from '../ColorProcessor';
import {useTranslation} from '../internationalization/useTranslation';
import {ActivitiesList} from './ActivitiesList';
import {
  STANDARD_ELEMENT_WIDTH,
  SUBACTIVITY_LEVEL_WIDTH_DECREMENT,
  ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
} from '../constants';
import TimerButton from './TimerButton';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {addedSubactivities, removedSubactivity} from './redux/activityActions';
import {feedbackMessageInvoked} from '../feedback/FeedbackActions';
import {useIntervals} from '../interval/useIntervals';

export interface Activity {
  id: IdType;
  parentId: IdType;
  name: string;
  color?: ColorPalette.Color;
  subactivitiesIds?: IdType[];
  intervalsIds?: IdType[];
  currentlyActiveIntervalId: IdType;
}

export interface ActivityElementProps extends Activity {
  hideTracker?: boolean;
  width?: number;
  setCurrentlyPressingId?: (id: IdType) => void;
}

export interface ExpandableActivityProps extends ActivityElementProps {
  isExpanded: boolean;
  setIsExpanded: (shouldExpand: boolean, id: IdType) => void;
  getSubactivities: (id: IdType) => Activity[];
  getActivity: (id: IdType) => Activity | null;
  canAddSubactivities: (id: IdType) => boolean;
  setCurrentlyPressingId?: (id: IdType) => void;
}

const ActivityOptionsMenuBar = React.memo(function (
  props: ExpandableActivityProps,
) {
  const {id, width} = props;
  const hasIntervals = useIntervals(id).intervals.length > 0;
  return (
    <View
      style={{
        ...commonStyles.container,
        ...styles.activityOptionsMenuBar,
        width,
      }}>
      <DeleteOption id={id} />
      <JoinOption id={id} />
      <EditOption id={id} />
      {hasIntervals && <HistoryOption id={id} />}
    </View>
  );
});

interface AddSubactivityProps extends IdProp {
  id: IdType;
  width?: number;
}

export const AddSubactivityOption = React.memo(function (
  props: AddSubactivityProps,
) {
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
});

export const ExpandedSection = React.memo(function (
  props: ExpandableActivityProps,
) {
  const {
    id,
    getSubactivities,
    getActivity,
    canAddSubactivities,
    width = STANDARD_ELEMENT_WIDTH,
  } = props;
  const dispatch = useDispatch();
  const subactivities = getSubactivities(id);
  const {translate} = useTranslation();
  const onSwipeLeft = useCallback(
    (subactivityId: IdType) => {
      const parentId = id;
      dispatch(removedSubactivity(subactivityId));
      dispatch(
        feedbackMessageInvoked({
          feedbackType: 'info',
          message: translate('Subtrackable-Removed-From-Project'),
          secondaryMessage: translate('Press-Here-To-Undo'),
          undoAction: addedSubactivities(parentId, [subactivityId]),
        }),
      );
    },
    [dispatch, id, translate],
  );
  return (
    <CustomPressable
      style={{...commonStyles.container, ...styles.expandedSection}}>
      <ActivityOptionsMenuBar {...props} />
      <View
        style={{
          ...commonStyles.container,
        }}>
        {subactivities.length > 0 && (
          <ActivitiesList
            getSubactivities={getSubactivities}
            getActivity={getActivity}
            canAddSubactivities={canAddSubactivities}
            activities={subactivities}
            elementWidth={width - SUBACTIVITY_LEVEL_WIDTH_DECREMENT}
            onSwipeLeft={onSwipeLeft}
          />
        )}
      </View>
      <View style={{padding: SPACE_BETWEEN_ELEMENTS / 2}} />
      {canAddSubactivities(id) && (
        <AddSubactivityOption id={id} width={width} />
      )}
    </CustomPressable>
  );
});

export const ActivityElement = React.memo(function (
  props: ActivityElementProps,
) {
  const {hideTracker, id, name, width, color} = props;
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
      <Text
        style={{
          ...commonStyles.textStyle,
          ...styles.textStyle,
          position: 'absolute',
        }}>
        {name}
      </Text>
      {!hideTracker && (
        <View style={styles.timerButtonPosition}>
          <TimerButton id={id} />
        </View>
      )}
    </View>
  );
});

export const ExpandableActivityElement = React.memo(function (
  props: ExpandableActivityProps,
) {
  const {
    id,
    isExpanded,
    setIsExpanded,
    width = STANDARD_ELEMENT_WIDTH,
    color,
    setCurrentlyPressingId,
  } = props;
  const activityProps = {
    ...props,
    color: undefined,
  };
  const pressableTrackingCallbacks = useMemo(
    () => ({
      onPressIn: () => setCurrentlyPressingId?.(id),
      onPressOut: () => setCurrentlyPressingId?.(null),
    }),
    [id, setCurrentlyPressingId],
  );
  return (
    <View style={{padding: SPACE_BETWEEN_ELEMENTS / 2}}>
      <CustomPressable
        {...pressableTrackingCallbacks}
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
});

export const styles = StyleSheet.create({
  expandableActivityElement: {
    backgroundColor: ColorPalette.activityDefaultColor_RGBSerialized,
  },
  activityElement: {
    width: STANDARD_ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
  },
  textStyle: {
    fontSize: 25,
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
  timerButtonPosition: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
});
