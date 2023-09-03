import React from 'react';
import {StatusBar} from 'react-native';
import GradientBackground from './src/screens/GradientBackground';
import {ActivitiesListScreen} from './src/screens/ActivitiesListScreen';
import {Provider} from 'react-redux';
import createSagaMiddleware from '@redux-saga/core';
import {enableMapSet} from 'immer';
import rootReducer from './src/redux/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import activitiesSagas from './src/activity/activitySagas';

enableMapSet();

const sagaMiddleware = createSagaMiddleware();

let store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(activitiesSagas);

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content" // Set barStyle to 'light-content'
        translucent={true}
      />
      <GradientBackground>
        <ActivitiesListScreen />
      </GradientBackground>
    </Provider>
  );
}

export default App;
