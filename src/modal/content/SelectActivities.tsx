import {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import useActivities from '../../activity/useActivities';
import {commonStyles} from '../../commonStyles';
import {
  Activity,
  ActivityElement,
  ELEMENT_HEIGHT,
} from '../../components/ActivityElement';
import CustomPressable from '../../components/Pressable';
import {SelectionList} from '../../components/SelectionList';
import {useTranslation} from '../../internationalization/useTranslation';
import {SPACE_BETWEEN_ELEMENTS} from '../../screens/ActivitiesListScreen';
import GradientBackground from '../../screens/GradientBackground';
import * as ColorPalette from '../../ColorPalette';
import * as ColorProcessor from '../../ColorProcessor';

export interface SelectActivitiesProps {
  headerText: string;
}

export interface SelectActivitiesProps {
  onConfirmSelection: (selectedIds: Array<string>) => void;
}

export function SelectActivities(props: SelectActivitiesProps) {
  const {headerText, onConfirmSelection} = props;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {activities, getActivityById} = useActivities();
  const {translate} = useTranslation();
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
            getActivityById={getActivityById}
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
        data={activities}
        renderInnerItem={renderInnerItem}
      />
      <CustomPressable
        style={{...commonStyles.roundedElementBorder, ...styles.confirmButton}}
        onPress={() => onConfirmSelection([...selectedIds.values()])}>
        <Text style={{...commonStyles.textStyle, ...styles.confirmButtonText}}>
          {translate('Combine-Activities')}
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
