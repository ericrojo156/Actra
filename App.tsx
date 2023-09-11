import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import createSagaMiddleware from '@redux-saga/core';
import {enableMapSet} from 'immer';
import rootReducer from './src/redux/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import activitiesSagas from './src/activity/activitySagas';
import {NavigationContainer} from '@react-navigation/native';
import * as ColorPalette from './src/ColorPalette';
import ActivityListScreen from './src/screens/MainScreen';
import {useTranslation} from './src/internationalization/useTranslation';
import {useActivitiesFetch} from './src/activity/useActivities';

enableMapSet();

const sagaMiddleware = createSagaMiddleware();

let store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(activitiesSagas);

export type RootStackParamsList = {
  ActivitiesListScreen: {};
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
          name="ActivitiesListScreen"
          component={ActivityListScreen}
          options={{headerShown: false}}
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
