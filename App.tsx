import React from 'react';
import {StatusBar} from 'react-native';
import GradientBackground from './src/screens/GradientBackground';
import {ActivitiesListScreen} from './src/screens/ActivitiesListScreen';

function App(): JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="light-content" // Set barStyle to 'light-content'
        translucent={true}
      />
      <GradientBackground>
        <ActivitiesListScreen />
      </GradientBackground>
    </>
  );
}

export default App;
