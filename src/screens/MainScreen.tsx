import React from 'react';
import {Modal, Text, View} from 'react-native';
import useActivities from '../activity/useActivities';
import GradientBackground from './GradientBackground';
import {ModalContent, useModal} from '../modal/Modal';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';
import {ActivitiesList} from '../activity/ActivitiesList';
import {SPACE_BETWEEN_ELEMENTS} from '../constants';

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
      <ActivitiesList activities={activities} getActivity={getActivity} />
      <View style={{marginBottom: 40}} />
    </GradientBackground>
  );
}

export default React.memo(MainScreen);
