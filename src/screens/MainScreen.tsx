import React, {useCallback, useMemo, useState} from 'react';
import {
  Modal,
  Text,
  View,
  FlatList,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  Activity,
  ELEMENT_HEIGHT,
  ExpandedActivityElement,
  STANDARD_ELEMENT_WIDTH,
} from '../components/ActivityElement';
import useActivities, {GetActivity} from '../activity/useActivities';
import GradientBackground from './GradientBackground';
import {ModalContent, useModal} from '../modal/Modal';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';

export const SPACE_BETWEEN_ELEMENTS = 5;

function useLayoutAnimation() {
  const layoutAnimConfig = useMemo(
    () => ({
      duration: 100,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    }),
    [],
  );
  LayoutAnimation.configureNext(layoutAnimConfig);
}

interface ActivitiesListProps {
  activities: Activity[];
  getActivity: GetActivity;
  customStyle?: any;
  width?: number;
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  const {
    getActivity,
    activities,
    width = STANDARD_ELEMENT_WIDTH,
    customStyle = {},
  } = props;
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: string) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );
  useLayoutAnimation();
  return (
    <View style={{...styles.activitiesListContainer, ...customStyle}}>
      <FlatList
        data={activities}
        renderItem={({item}) => (
          <>
            <ExpandedActivityElement
              getActivity={getActivity}
              isExpanded={isExpanded}
              setIsExpanded={(shouldExpand: boolean) => {
                setCurrentlyExpandedActivity(shouldExpand ? item.id : null);
              }}
              {...item}
              width={width}
            />
            <View style={{marginTop: SPACE_BETWEEN_ELEMENTS}} />
          </>
        )}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={20}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: ELEMENT_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
});

function MainScreen() {
  const {activities, getActivity} = useActivities();
  const {activeModal, params, closeModal} = useModal();
  const {translate} = useTranslation();
  const headerText = translate('Activities');
  return (
    <GradientBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={activeModal !== null}
        onRequestClose={() => {
          closeModal();
        }}>
        <ModalContent params={params} activeModal={activeModal} />
      </Modal>
      <View style={{marginTop: '10%'}} />
      <Text
        style={{
          ...commonStyles.headerTextStyle,
        }}>
        {headerText}
      </Text>
      <View style={{marginBottom: SPACE_BETWEEN_ELEMENTS}} />
      <ActivitiesList
        customStyle={styles.activitiesListContainer}
        activities={activities}
        getActivity={getActivity}
      />
      <View style={{marginBottom: 40}} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '85%',
  },
});

export default React.memo(MainScreen);
