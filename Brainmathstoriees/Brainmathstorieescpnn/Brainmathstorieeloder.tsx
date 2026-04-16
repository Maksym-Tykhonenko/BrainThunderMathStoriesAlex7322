// loader

import WebView from 'react-native-webview';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';

import {useNavigation} from '@react-navigation/native';

import {Animated} from 'react-native';

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

const brainmathstorieeLoaderHTML = `
  <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: transparent;
          }

          .spinner {
            width: 60px;
            height: 60px;
            position: relative;
          }

          .spinner .dot {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: center;
            animation: spin 2s infinite linear;
          }

          .spinner .dot::after {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: rgb(12, 180, 231);
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .spinner .dot:nth-child(2) {
            animation-delay: 0.1s;
          }

          .spinner .dot:nth-child(3) {
            animation-delay: 0.2s;
          }

          .spinner .dot:nth-child(4) {
            animation-delay: 0.3s;
          }

          .spinner .dot:nth-child(5) {
            animation-delay: 0.4s;
          }
        </style>
      </head>
      <body>
        <div class="spinner">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </body>
    </html>
`;

const Brainmathstorieeloder = () => {
  const navigation = useNavigation();

  //useEffect(() => {
  //  const brainmathstorieeTimer = setTimeout(() => {
  //    navigation.replace('Brainmathstorieesonb' as never);
  //  }, 6000);
//
  //  return () => clearTimeout(brainmathstorieeTimer);
  //}, [navigation]);

  return (
    <ImageBackground
      source={require('../../elements/i/brainmathstorieelod.png')}
      style={styles.brainmathstorieeImageBg}
      resizeMode="cover">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.brainmathstorieeWebviewDock}>
          <WebView
            originWhitelist={['*']}
            source={{html: brainmathstorieeLoaderHTML}}
            style={styles.brainmathstorieeWebview}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Brainmathstorieeloder;

const styles = StyleSheet.create({
  brainmathstorieeImageBg: {
    flex: 1,
  },
  brainmathstorieeWebviewDock: {
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  brainmathstorieeWebview: {
    backgroundColor: 'transparent',
    width: 260,
    height: 150,
  },
});
