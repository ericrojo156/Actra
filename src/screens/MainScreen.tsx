import React, {ReactElement} from 'react';
import {Modal, Text, View} from 'react-native';
import useActivities from '../activity/useActivities';
import GradientBackground from './GradientBackground';
import {ModalContent, useModal} from '../modal/Modal';
import {commonStyles} from '../commonStyles';
import {useTranslation} from '../internationalization/useTranslation';
import {ActivitiesList} from '../activity/ActivitiesList';
import {FloatingCreateActivityButton} from '../activity/CreateActivityOption';
import {SPACE_BETWEEN_ELEMENTS} from '../constants';
import {CurrentlyActiveActivityBanner} from '../activity/CurrentlyActiveActivityBanner';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import * as ColorPalette from '../ColorPalette';
import ChartScreen from './ChartScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChartIcon from '../assets/ChartIcon';
import {RouteProp, ParamListBase} from '@react-navigation/native';

const LIST_PIXELS_HEIGHT_WITH_TOP_BANNER = 620;
const LIST_PIXELS_HEIGHT_WITHOUT_TOP_BANNER = 700;

function ActivitiesListScreen() {
  const {activities, getSubactivities, getActivity, canAddSubactivities} =
    useActivities(null);
  const {activeModal, params, closeModal} = useModal();
  const {translate} = useTranslation();
  const headerText = translate('Activities');
  const thereIsACurrentlyActiveActivity = useSelector(
    (state: ApplicationState) => state.activity.currentlyActive !== null,
  );
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
        <CurrentlyActiveActivityBanner />
        <View style={{paddingTop: SPACE_BETWEEN_ELEMENTS * 3}} />
        <ActivitiesList
          listHeight={
            thereIsACurrentlyActiveActivity
              ? LIST_PIXELS_HEIGHT_WITH_TOP_BANNER
              : LIST_PIXELS_HEIGHT_WITHOUT_TOP_BANNER
          }
          activities={activities}
          getSubactivities={getSubactivities}
          getActivity={getActivity}
          canAddSubactivities={canAddSubactivities}
        />
      </View>
      <FloatingCreateActivityButton />
    </GradientBackground>
  );
}

const Tab = createMaterialBottomTabNavigator();

const getTabBarIcon = (route: RouteProp<ParamListBase, string>) => {
  let size: number = 25;
  // @ts-ignore
  return ({focused}) => {
    let icon: string | ReactElement = 'none';
    let iconColor = focused
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(255, 255, 255, 0.2)';
    if (route.name === 'ActivitiesListScreen') {
      icon = 'timer-sand';
    } else if (route.name === 'Profile') {
      icon = 'account';
    } else if (route.name === 'ChartScreen') {
      icon = <ChartIcon fill={iconColor} />;
    } else {
      throw Error(`Error: invalid tab navigator route name: ${route.name}`);
    }
    if (typeof icon !== 'string') {
      return icon; // case where custom SVG is imported as a React element
    }
    return <MaterialCommunityIcons name={icon} color={iconColor} size={size} />;
  };
};

function MainScreen() {
  const {translate} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={'ActivitiesListScreen'}
      screenOptions={({route}) => ({
        swipeEnabled: false,
        tabBarIcon: getTabBarIcon(route),
      })}
      barStyle={{backgroundColor: ColorPalette.SoftBlack_RGBASerialized}}>
      <Tab.Screen
        options={{title: translate('Time-Chart')}}
        name={'ChartScreen'}
        component={ChartScreen}
      />
      <Tab.Screen
        options={{title: translate('Activities')}}
        name={'ActivitiesListScreen'}
        component={ActivitiesListScreen}
      />
    </Tab.Navigator>
  );
}

export default React.memo(MainScreen);
