import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import createSagaMiddleware from '@redux-saga/core';
import {enableMapSet} from 'immer';
import rootReducer from './src/redux/rootReducer';
import {configureStore} from '@reduxjs/toolkit';
import activitiesSagas from './src/activity/redux/activitySagas';
import storeSagas from './src/store/redux/storeSagas';
import intervalsSaga from './src/interval/redux/IntervalsSagas';
import {NavigationContainer} from '@react-navigation/native';
import * as ColorPalette from './src/ColorPalette';
import MainScreen from './src/screens/MainScreen';
import {useTranslation} from './src/internationalization/useTranslation';
import History from './src/screens/History';
import {IdProp} from './src/types';
import {commonStyles} from './src/commonStyles';
import {useLoadedStore} from './src/store/usePersistentStore';
import {FlashMessageBanner} from './src/feedback/FlashMessageBanner';
import {EditInterval} from './src/screens/EditInterval';
import {Interval} from './src/interval/types';
import {useAnalytics} from './src/analytics/useAnalytics';
import {getTimeSpanSincePrevious6AM} from './src/time/utils';
import {TimeSpan} from './src/time/types';

enableMapSet();

const sagaMiddleware = createSagaMiddleware();

let store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(activitiesSagas);
sagaMiddleware.run(storeSagas);
sagaMiddleware.run(intervalsSaga);

export type RootStackParamsList = {
  Main: {};
  History: IdProp;
  EditInterval: {interval: Interval};
};

const RootStack = createStackNavigator<RootStackParamsList>();

function Screens() {
  // ---- FOR VALIDATION DURING DEVELOPMENT ----
  const timeSpanSincePrevious6AM: TimeSpan = getTimeSpanSincePrevious6AM();
  const analyticsChartProps = useAnalytics(timeSpanSincePrevious6AM);
  console.log(analyticsChartProps);
  // -------------------------
  useLoadedStore();
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
        <RootStack.Screen
          name="EditInterval"
          component={EditInterval}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackTitle: translate('Back'),
            headerTintColor: ColorPalette.OffWhite_RGBSerialized,
            headerTitleStyle: commonStyles.headerTextStyle,
          }}
        />
      </RootStack.Navigator>
      <FlashMessageBanner />
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
