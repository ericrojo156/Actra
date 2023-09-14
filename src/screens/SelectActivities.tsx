import GradientBackground from './GradientBackground';
import * as ColorPalette from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import useActivities from '../activity/useActivities';
import {useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Activity, ActivityElement} from '../activity/ActivityElement';
import {commonStyles} from '../commonStyles';
import CustomPressable from '../components/Pressable';
import {SelectionList} from '../components/SelectionList';
import {ELEMENT_HEIGHT, SPACE_BETWEEN_ELEMENTS} from '../constants';

export interface SelectActivitiesProps {
  headerText: string;
}

export interface ConfirmationTextProps {
  text1: string;
  text2?: string;
}

export interface SelectActivitiesProps {
  confirmationButtonText: ConfirmationTextProps;
  onConfirmSelection: (selectedIds: Array<string>) => void;
  filterCondition?: (activity: Activity) => boolean;
}

export function SelectActivities(props: SelectActivitiesProps) {
  const {
    filterCondition,
    headerText,
    confirmationButtonText,
    onConfirmSelection,
  } = props;
  const {text1: confirmationText1, text2: confirmationText2} =
    confirmationButtonText;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {activities, getActivity} = useActivities();
  const data = useMemo(
    () => (filterCondition ? activities.filter(filterCondition) : activities),
    [filterCondition, activities],
  );
  const renderInnerItem = (activity: Activity | null, isSelected: boolean) => {
    if (activity) {
      return (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...commonStyles.roundedElementBorder,
            backgroundColor: ColorProcessor.serialize(activity.color),
            ...(isSelected ? styles.selectedActivityStyle : {}),
          }}>
          <ActivityElement
            {...activity}
            getActivity={getActivity}
            color={undefined}
          />
        </View>
      );
    }
    return null;
  };
  return (
    <GradientBackground>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 50,
          marginBottom: 10,
        }}>
        <Text
          style={{
            ...commonStyles.headerTextStyle,
            ...styles.headerStyle,
          }}>
          {headerText}
        </Text>
      </View>
      <SelectionList
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        data={data}
        renderInnerItem={renderInnerItem}
      />
      <CustomPressable
        style={{...commonStyles.roundedElementBorder, ...styles.confirmButton}}
        onPress={() => onConfirmSelection([...selectedIds.values()])}>
        <Text style={{...commonStyles.textStyle, ...styles.confirmButtonText}}>
          {confirmationText1}
        </Text>
        <Text style={{...commonStyles.textStyle, ...styles.confirmButtonText}}>
          {confirmationText2}
        </Text>
      </CustomPressable>
      <View style={{marginBottom: 50}} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    display: 'flex',
    alignSelf: 'center',
    fontSize: 25,
  },
  selectedActivityStyle: {
    borderColor: ColorPalette.OffWhite_RGBSerialized,
    borderWidth: 3,
  },
  confirmButtonText: {
    fontSize: 20,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ELEMENT_HEIGHT,

    backgroundColor: ColorPalette.actionColorSerialized,
    marginTop: SPACE_BETWEEN_ELEMENTS,
    marginBottom: SPACE_BETWEEN_ELEMENTS,
    paddingHorizontal: 20,
  },
});
