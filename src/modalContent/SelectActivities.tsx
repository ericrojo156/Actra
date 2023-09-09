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

export interface SelectActivitiesProps {
  headerText: string;
}

interface SelectableItem {
  id: string;
}

interface SelectionListProps<T extends SelectableItem> {
  data: T[];
  renderInnerItem: (props: T | null) => ReactElement | null;
}

function SelectionList<T extends SelectableItem>(props: SelectionListProps<T>) {
  const {data, renderInnerItem} = props;
  const dataMap: Map<string, T> = useMemo(
    () => new Map(data?.map(child => [child.id, child]) ?? []),
    [data],
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const addSelectedId = useCallback(
    (id: string) => {
      const updatedSet = new Set(selectedIds);
      updatedSet.add(id);
      setSelectedIds(updatedSet);
    },
    [selectedIds],
  );
  const renderItem = ({item}: ListRenderItemInfo<T>) => (
    <Pressable onPress={() => addSelectedId(item.id)}>
      {renderInnerItem(dataMap.get(item.id) ?? null)}
      <View style={{marginTop: SPACE_BETWEEN_ELEMENTS}} />
    </Pressable>
  );
  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={20}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: ELEMENT_HEIGHT * index,
          index,
        })}
      />
    </>
  );
}

export function SelectActivities(props: SelectActivitiesProps) {
  const {headerText} = props;
  const {activities, getActivityById} = useActivities();
  const renderInnerItem = (activity: Activity | null) => {
    if (activity) {
      return (
        <ActivityElement
          {...activity}
          width={STANDARD_ELEMENT_WIDTH}
          getActivityById={getActivityById}
        />
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
            ...style.headerStyle,
          }}>
          {headerText}
        </Text>
      </View>
      <SelectionList data={activities} renderInnerItem={renderInnerItem} />
    </GradientBackground>
  );
}

const style = StyleSheet.create({
  headerStyle: {
    display: 'flex',
    alignSelf: 'center',
    fontSize: 20,
  },
});
