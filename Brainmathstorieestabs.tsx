import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useRef} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';

import Brainmathstorieesminig from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieesminig';
import Brainmathstorieeslgnds from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieeslgnds';
import Brainmathstorieesquz from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieesquz';
import Brainmathstorieeschall from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieeschall';
import Brainmathstorieesacvm from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieesacvm';
import Brainmathstorieesettgs from './Brainmathstoriees/Brainmathstorieesscrns/Brainmathstorieesettgs';

const Tab = createBottomTabNavigator();

const AnimatedTabButton = (props: Record<string, unknown>) => {
  const {children, style, onPress, onLongPress, ...rest} = props;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress as () => void}
      onLongPress={onLongPress as (() => void) | undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style as ViewStyle, styles.brainmathstorieestabsButton]}
      {...rest}>
      <Animated.View
        style={[
          styles.brainmathstorieestabsButtonInner,
          {transform: [{scale}]},
        ]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
};

const OceatrippguiddetabIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Image source={source} tintColor={focused ? null : '#fff'} />
      {focused && (
        <Image
          source={require('./elements/i/brainmathssel.png')}
          style={{
            position: 'absolute',
            bottom: -5.5,
            right: -5.5,
          }}
        />
      )}
    </View>
  );
};

const brainmathstorieestabsIconPlaces = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab1.png')}
    inactiveTintColor="#ffffff"
  />
);

const brainmathstorieestabsIconSaved = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab2.png')}
  />
);

const brainmathstorieestabsIconMap = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab3.png')}
  />
);

const brainmathstorieestabsIconBlog = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab4.png')}
  />
);

const brainmathstorieestabsIconFacts = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab5.png')}
  />
);

const brainmathstorieestabsIconQuiz = ({focused}: {focused: boolean}) => (
  <OceatrippguiddetabIcon
    focused={focused}
    source={require('./elements/i/brainmathstortab6.png')}
  />
);

const brainmathstorieestabsButton = (props: Record<string, unknown>) => (
  <AnimatedTabButton {...props} />
);

const Brainmathstorieestabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.brainmathstorieestabsBar],
        tabBarActiveTintColor: '#FFFFFF',
        tabBarButton: brainmathstorieestabsButton,
      }}>
      <Tab.Screen
        name="Brainmathstorieesminig"
        component={Brainmathstorieesminig}
        options={{
          tabBarIcon: brainmathstorieestabsIconPlaces,
        }}
      />
      <Tab.Screen
        name="Brainmathstorieeslgnds"
        component={Brainmathstorieeslgnds}
        options={{
          tabBarIcon: brainmathstorieestabsIconSaved,
        }}
      />
      <Tab.Screen
        name="Brainmathstorieesquz"
        component={Brainmathstorieesquz}
        options={{
          tabBarIcon: brainmathstorieestabsIconMap,
        }}
      />
      <Tab.Screen
        name="Brainmathstorieeschall"
        component={Brainmathstorieeschall}
        options={{
          tabBarIcon: brainmathstorieestabsIconBlog,
        }}
      />
      <Tab.Screen
        name="Brainmathstorieesacvm"
        component={Brainmathstorieesacvm}
        options={{
          tabBarIcon: brainmathstorieestabsIconFacts,
        }}
      />
      <Tab.Screen
        name="Brainmathstorieesettgs"
        component={Brainmathstorieesettgs}
        options={{
          tabBarIcon: brainmathstorieestabsIconQuiz,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  brainmathstorieestabsButton: {
    flex: 1,
  },
  brainmathstorieestabsButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brainmathstorieestabsIconCircle: {
    width: 55,
    height: 55,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  brainmathstorieestabsIconCircleFocused: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  brainmathstorieestabsLabel: {
    fontSize: 8,
    fontWeight: '400',
    marginTop: 2,
  },
  brainmathstorieestabsBar: {
    elevation: 0,
    paddingTop: 6,
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 18,
    borderColor: '#303030',
    borderTopWidth: 1,
    borderTopColor: '#303030',
    backgroundColor: '#303030',
    height: 90,
    paddingBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
});

export default Brainmathstorieestabs;
