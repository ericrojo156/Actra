import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import createSagaMiddleware from '@redux-saga/core';
import {enableMapSet} from 'immer';
import rootReducer from './src/redux/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import activitiesSagas from './src/activity/redux/activitySagas';
import {NavigationContainer} from '@react-navigation/native';
import * as ColorPalette from './src/ColorPalette';
import MainScreen from './src/screens/MainScreen';
import {useTranslation} from './src/internationalization/useTranslation';
import {useActivitiesFetch} from './src/activity/useActivities';
import History from './src/screens/History';
import {IdProp} from './src/types';
import {commonStyles} from './src/commonStyles';

enableMapSet();

const sagaMiddleware = createSagaMiddleware();

let store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(activitiesSagas);

export type RootStackParamsList = {
  Main: {};
  History: IdProp;
};

const RootStack = createStackNavigator<RootStackParamsList>();

function Screens() {
  useActivitiesFetch();
  const {translate} = useTranslation();
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" translucent={true} />
      <RootStack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerBackTitle: translate('Back'),
          headerTintColor: ColorPalette.OffWhite_RGBSerialized,
        }}>
        <RootStack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="History"
          component={History}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackTitle: translate('Back'),
            headerTintColor: ColorPalette.OffWhite_RGBSerialized,
            headerTitleStyle: commonStyles.headerTextStyle,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Screens />
    </Provider>
  );
}

export default App;
