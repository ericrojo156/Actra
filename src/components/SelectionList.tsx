import React, {ReactElement, useMemo, useCallback} from 'react';
import {ListRenderItemInfo, View, FlatList, StyleSheet} from 'react-native';
import * as ColorPalette from '../ColorPalette';
import CustomPressable from './Pressable';
import {useDispatch} from 'react-redux';
import {
  addSubactivitiesModalOpened,
  joinActivitiesModalOpened,
} from '../modal/modalActions';
import {
  ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
  STANDARD_ELEMENT_WIDTH,
} from '../constants';
import {IdType} from '../types';

export function useSelectionModal() {
  const dispatch = useDispatch();
  const openJoinActivitiesModal = useCallback(
    (params: SelectionModalParams) => {
      dispatch(
        joinActivitiesModalOpened({
          params,
        }),
      );
    },
    [dispatch],
  );
  const openAddSubactivitiesModal = useCallback(
    (params: SelectionModalParams) => {
      dispatch(
        addSubactivitiesModalOpened({
          params,
        }),
      );
    },
    [dispatch],
  );
  return {
    openJoinActivitiesModal,
    openAddSubactivitiesModal,
  };
}

export enum SELECTION_TYPE {
  MULTI_SELECT,
  SINGLE_SELECT,
}
export interface SelectionModalParams {
  id: IdType;
  selectionType: SELECTION_TYPE.MULTI_SELECT;
}

export interface CreateSubactivityParams {
  parentId: IdType;
  shouldAddAsSubactivity?: boolean;
}

export interface SelectableItem {
  id: IdType;
}

export interface SelectionListProps<T extends SelectableItem> {
  data: T[];
  renderInnerItem: (
    props: T | null,
    isSelected: boolean,
  ) => ReactElement | null;
  selectedIds: Set<IdType>;
  setSelectedIds: (ids: Set<IdType>) => void;
}

export function SelectionList<T extends SelectableItem>(
  props: SelectionListProps<T>,
) {
  const {selectedIds, setSelectedIds} = props;
  const {data, renderInnerItem} = props;
  const dataMap: Map<IdType, T> = useMemo(
    () => new Map(data?.map(child => [child.id, child]) ?? []),
    [data],
  );
  const toggleSelection = useCallback(
    (id: IdType) => {
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
    (id: IdType) => selectedIds.has(id),
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
      <View style={{paddingTop: SPACE_BETWEEN_ELEMENTS}} />
    </View>
  );
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id ?? ''}
      initialNumToRender={20}
      windowSize={5}
      getItemLayout={(_data, index) => ({
        length: 100,
        offset: ELEMENT_HEIGHT * index,
        index,
      })}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    alignItems: 'center',
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
