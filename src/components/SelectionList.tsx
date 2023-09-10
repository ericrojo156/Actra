import {ReactElement, useMemo, useCallback} from 'react';
import {ListRenderItemInfo, View, FlatList, StyleSheet} from 'react-native';
import {SPACE_BETWEEN_ELEMENTS} from '../screens/ActivitiesListScreen';
import {ELEMENT_HEIGHT, STANDARD_ELEMENT_WIDTH} from './ActivityElement';
import * as ColorPalette from '../ColorPalette';
import CustomPressable from './Pressable';

export enum SELECTION_TYPE {
  MULTI_SELECT,
  SINGLE_SELECT,
}
export interface SelectionModalParams {
  id: string;
  selectionType: SELECTION_TYPE.MULTI_SELECT;
  onConfirm: (selectedItems: string[]) => void;
}
export function openSelectionModal(_params: SelectionModalParams) {}

export interface SelectableItem {
  id: string;
}

export interface SelectionListProps<T extends SelectableItem> {
  data: T[];
  renderInnerItem: (
    props: T | null,
    isSelected: boolean,
  ) => ReactElement | null;
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
}

export function SelectionList<T extends SelectableItem>(
  props: SelectionListProps<T>,
) {
  const {selectedIds, setSelectedIds} = props;
  const {data, renderInnerItem} = props;
  const dataMap: Map<string, T> = useMemo(
    () => new Map(data?.map(child => [child.id, child]) ?? []),
    [data],
  );
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
    [selectedIds, setSelectedIds],
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
      <CustomPressable onPress={() => toggleSelection(item.id)}>
        {renderInnerItem(dataMap.get(item.id) ?? null, isSelected(item.id))}
      </CustomPressable>
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

const styles = StyleSheet.create({
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
