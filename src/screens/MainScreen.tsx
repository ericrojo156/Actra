import React from 'react';
import {Modal, Text, View} from 'react-native';
import useActivities from '../activity/useActivities';
import GradientBackground from './GradientBackground';
import {ModalContent, useModal} from '../modal/Modal';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';
import {ActivitiesList} from '../activity/ActivitiesList';
import CreateActivityOption from '../activity/CreateActivityOption';
import * as ColorPalette from '../ColorPalette';
import {SPACE_BETWEEN_ELEMENTS} from '../constants';

function MainScreen() {
  const {activities, getSubactivities, getActivity, canAddSubactivities} =
    useActivities(null);
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
      <View
        style={{
          ...commonStyles.container,
          paddingTop: 40,
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{
            ...commonStyles.headerTextStyle,
          }}>
          {headerText}
        </Text>
        <View style={{paddingTop: SPACE_BETWEEN_ELEMENTS * 3}} />
        <ActivitiesList
          listHeight={'85%'}
          activities={activities}
          getSubactivities={getSubactivities}
          getActivity={getActivity}
          canAddSubactivities={canAddSubactivities}
        />
      </View>
      <View
        style={{
          zIndex: 10,
          position: 'absolute',
          transform: [{translateY: 350}, {translateX: 90}],
        }}>
        <CreateActivityOption color={ColorPalette.SoftBlack} />
      </View>
    </GradientBackground>
  );
}

export default React.memo(MainScreen);
