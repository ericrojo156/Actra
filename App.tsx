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
import ActivityListScreen from './src/screens/ActivitiesListScreen';

enableMapSet();

const sagaMiddleware = createSagaMiddleware();

let store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(activitiesSagas);

const RootStack = createStackNavigator();

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content" // Set barStyle to 'light-content'
          translucent={true}
        />
        <RootStack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerBackTitle: 'dict.Back',
            headerTintColor: ColorPalette.OffWhite_RGBSerialized,
          }}>
          <RootStack.Screen
            name="ActivitiesListScreen"
            component={ActivityListScreen}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
