import React from 'react';
import {StyleSheet, View} from 'react-native';
import PressableIcon from '../components/PressableIcon';
import {Color} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import useActivityOptionCallbacks from './useActivityOptionsActions';
import {CreateSubactivityParams} from '../components/SelectionList';
import {IdType} from '../types';

const DIAMETER = 65;

interface CreateActivityProps {
  color: Color;
}

export function CreateActivityOption(props: CreateActivityProps) {
  const {onCreateActivityOption} = useActivityOptionCallbacks();
  const {color} = props;
  return (
    <PressableIcon
      onPress={() => onCreateActivityOption()}
      style={{
        backgroundColor: ColorProcessor.serialize(color),
        ...styles.circularButton,
      }}
      iconName="plus"
    />
  );
}

export function CreateSubactivityOption(
  props: CreateActivityProps & CreateSubactivityParams,
) {
  const {onCreateActivityOption} = useActivityOptionCallbacks();
  const {parentId, color} = props;
  return (
    <PressableIcon
      onPress={() => onCreateActivityOption(parentId, true)}
      style={{
        backgroundColor: ColorProcessor.serialize(color),
        ...styles.circularButton,
      }}
      iconName="plus"
    />
  );
}

export function FloatingCreateActivityButton(props: {
  parentId?: IdType;
  translateX?: number;
  translateY?: number;
  shouldCreate?: boolean;
}) {
  const {
    parentId = null,
    shouldCreate,
    translateY = 330,
    translateX = 90,
  } = props;
  return (
    <View
      style={{
        zIndex: 10,
        position: 'absolute',
        transform: [{translateX}, {translateY}],
      }}>
      {shouldCreate && parentId !== null ? (
        <CreateSubactivityOption
          parentId={parentId}
          color={ColorPalette.SoftBlack}
        />
      ) : (
        <CreateActivityOption color={ColorPalette.SoftBlack} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circularButton: {
    height: DIAMETER,
    width: DIAMETER,
    borderRadius: DIAMETER / 2,
    borderWidth: 2,
    borderColor: ColorPalette.OffWhite_RGBSerialized,
  },
});
