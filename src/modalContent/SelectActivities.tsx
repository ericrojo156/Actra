import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import GradientBackground from '../screens/GradientBackground';
import {commonStyles} from '../styles';
import Pressable from '../components/Pressable';
import {
  Activity,
  ActivityElement,
  ELEMENT_HEIGHT,
  STANDARD_ELEMENT_WIDTH,
} from '../components/ActivityElement';
import {SPACE_BETWEEN_ELEMENTS} from '../screens/ActivitiesListScreen';
import useActivities from '../activity/useActivities';
import {styles as activityStyles} from '../components/ActivityElement';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';

export interface SelectActivitiesProps {
  headerText: string;
}

interface SelectableItem {
  id: string;
}

interface SelectionListProps<T extends SelectableItem> {
  data: T[];
  renderInnerItem: (
    props: T | null,
    isSelected: boolean,
  ) => ReactElement | null;
}

function SelectionList<T extends SelectableItem>(props: SelectionListProps<T>) {
  const {data, renderInnerItem} = props;
  const dataMap: Map<string, T> = useMemo(
    () => new Map(data?.map(child => [child.id, child]) ?? []),
    [data],
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelection = useCallback(
    (id: string) => {
      const updatedSet = new Set(selectedIds);
      if (!updatedSet.has(id)) {
        updatedSet.add(id);
      } else {
        updatedSet.delete(id);
      }
      setSelectedIds(updatedSet);
    },
    [selectedIds],
  );
  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );
  const renderItem = ({item}: ListRenderItemInfo<T>) => (
    <View
      style={
        isSelected(item.id) ? styles.selectedStyle : styles.unselectedStyle
      }>
      <Pressable onPress={() => toggleSelection(item.id)}>
        {renderInnerItem(dataMap.get(item.id) ?? null, isSelected(item.id))}
      </Pressable>
      <View style={{marginTop: SPACE_BETWEEN_ELEMENTS}} />
    </View>
  );
  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={20}
        windowSize={5}
        getItemLayout={(_data, index) => ({
          length: 100,
          offset: ELEMENT_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      />
    </>
  );
}

export function SelectActivities(props: SelectActivitiesProps) {
  const {headerText} = props;
  const {activities, getActivityById} = useActivities();
  const renderInnerItem = (activity: Activity | null, isSelected: boolean) => {
    if (activity) {
      return (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...activityStyles.roundedElementBorder,
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
      <View>
        <View style={{marginTop: 100}} />
        <Text
          style={{
            ...commonStyles.headerTextStyle,
            ...styles.headerStyle,
          }}>
          {headerText}
        </Text>
      </View>
      <SelectionList data={activities} renderInnerItem={renderInnerItem} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    display: 'flex',
    alignSelf: 'center',
    fontSize: 20,
  },
  selectedActivityStyle: {
    borderColor: ColorPalette.OffWhite_RGBSerialized,
    borderWidth: 3,
  },
  selectedStyle: {
    width: STANDARD_ELEMENT_WIDTH - 20,
  },
  unselectedStyle: {
    width: STANDARD_ELEMENT_WIDTH,
  },
});
