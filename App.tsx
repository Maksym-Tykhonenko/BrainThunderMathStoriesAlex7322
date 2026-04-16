import {NavigationContainer} from '@react-navigation/native';
import Brainmathstorieenav from './Brainmathstoriees/Brainmathstorieesroute/Brainmathstorieenav';
import {BrainmathSettingsProvider} from './Brainmathstoriees/Brainmathstoriestorg/Brainmathstoriecntx';

const App = () => {
  return (
    <NavigationContainer>
      <BrainmathSettingsProvider>
        <Brainmathstorieenav />
      </BrainmathSettingsProvider>
    </NavigationContainer>
  );
};

export default App;
