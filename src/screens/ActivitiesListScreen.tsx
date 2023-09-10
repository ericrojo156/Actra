import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal, View, FlatList, StyleSheet, LayoutAnimation} from 'react-native';
import {
  Activity,
  ELEMENT_HEIGHT,
  ExpandedActivityElement,
  STANDARD_ELEMENT_WIDTH,
} from '../components/ActivityElement';
import useActivities, {GetActivityById} from '../activity/useActivities';
import GradientBackground from './GradientBackground';
import {SelectActivities} from '../modalContent/SelectActivities';
import {joinActivities} from '../activity/useActivityOptionsActions';
import {Language, useTranslation} from '../hooks/useTranslation';

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
  getActivityById: GetActivityById;
  width?: number;
}

export const ActivitiesList = React.memo((props: ActivitiesListProps) => {
  const {getActivityById, activities, width = STANDARD_ELEMENT_WIDTH} = props;
  const [currentlyExpandedActivity, setCurrentlyExpandedActivity] = useState<
    string | null
  >(null);
  const isExpanded = useCallback(
    (id: string) => currentlyExpandedActivity === id,
    [currentlyExpandedActivity],
  );
  useLayoutAnimation();
  return (
    <View style={styles.activitiesListContainer}>
      <FlatList
        data={activities}
        renderItem={({item}) => (
          <>
            <ExpandedActivityElement
              getActivityById={getActivityById}
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

function JoinActivities() {
  const {translate} = useTranslation(Language.ENGLISH);
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      onConfirmSelection={joinActivities}
    />
  );
}

function ActivitiesListScreen() {
  const {activities, getActivityById} = useActivities();
  const [modalIsVisible, setModalIsVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      // setModalIsVisible(true);
    }, 1000);
  }, []);
  return (
    <GradientBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalIsVisible}
        onRequestClose={() => {
          setModalIsVisible(!modalIsVisible);
        }}>
        <JoinActivities />
      </Modal>
      <View style={{marginTop: '10%'}} />
      <ActivitiesList
        activities={activities}
        getActivityById={getActivityById}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  activitiesListContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '90%',
  },
});

export default React.memo(ActivitiesListScreen);
