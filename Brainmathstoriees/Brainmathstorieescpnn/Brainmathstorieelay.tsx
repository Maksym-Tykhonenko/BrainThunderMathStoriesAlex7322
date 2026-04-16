import React from 'react';
import {ImageBackground, ScrollView, StyleSheet} from 'react-native';

const Brainmathstorieelay = ({children}: {children: React.ReactNode}) => {
  return (
    <ImageBackground
      source={require('../../elements/i/brainmathstbg.png')}
      style={styles.container}
      resizeMode="cover">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default Brainmathstorieelay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
