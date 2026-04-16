import Orientation from 'react-native-orientation-locker';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useCallback, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';

import {useStore} from '../Brainmathstoriestorg/Brainmathstoriecntx';

const Brainmathstorieesettgs = () => {
  const BRAINMATHSTORIEES_SAVED_KEY = 'brainmathstoriees.savedLegends.v1';
  const BRAINMATHSTORIEES_DAILY_KEY = 'brainmathstoriees.dailyChallenge.v1';
  const BRAINMATHSTORIEES_ACH_KEY = 'brainmathstoriees.achievements.v1';

  const [brainmathstorieResetOpen, setBrainmathstorieResetOpen] =
    useState(false);

  const {
    brainmathstorieBackgroundMusic,
    setBrainmathstorieBackgroundMusic,
    brainmathstorieVibration,
    setBrainmathstorieVibration,
  } = useStore() as any;

  const brainmathstorieShareApp = useCallback(async () => {
    Linking.openURL(
      'https://apps.apple.com/us/app/thunder-brain-stories/id6761808614',
    );
  }, []);

  const brainmathstorieToggleBackgroundMusic = async (
    selectedValue: boolean,
  ) => {
    try {
      await AsyncStorage.setItem(
        'toggleBrainmathstorieBackgroundMusic',
        JSON.stringify(selectedValue),
      );
      setBrainmathstorieBackgroundMusic(selectedValue);
    } catch (error) {
      console.log('Error background music', error);
    }
  };

  const brainmathstorieToggleVibration = async (selectedValue: boolean) => {
    try {
      await AsyncStorage.setItem(
        'toggleBrainmathstorieVibration',
        JSON.stringify(selectedValue),
      );
      setBrainmathstorieVibration(selectedValue);
    } catch (error) {
      console.log('Error vibration', error);
    }
  };

  const brainmathstorieResetProgress = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        BRAINMATHSTORIEES_SAVED_KEY,
        BRAINMATHSTORIEES_DAILY_KEY,
        BRAINMATHSTORIEES_ACH_KEY,
        'toggleBrainmathstorieBackgroundMusic',
        'toggleBrainmathstorieVibration',
      ]);
    } catch {
      console.log('error');
    } finally {
      setBrainmathstorieResetOpen(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (brainmathstorieResetOpen && Platform.OS === 'android') {
        Orientation.lockToPortrait();
      }

      return () => Orientation.unlockAllOrientations();
    }, [brainmathstorieResetOpen]),
  );

  return (
    <Brainmathstorieelay>
      <View style={styles.brainmathstorieScreen}>
        <LinearGradient
          colors={['#6A00FF', '#2A1460']}
          style={styles.brainmathstorieCard}>
          <View style={styles.brainmathstorieCardInner}>
            <Text style={styles.brainmathstorieTitle}>App Setup</Text>

            {Platform.OS === 'ios' && (
              <View style={styles.brainmathstorieRow}>
                <Text style={styles.brainmathstorieRowLabel}>Music</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    brainmathstorieToggleBackgroundMusic(
                      !brainmathstorieBackgroundMusic,
                    )
                  }>
                  <Image
                    source={
                      brainmathstorieBackgroundMusic
                        ? require('../../elements/i/brainmathsatogon.png')
                        : require('../../elements/i/brainmathsactogof.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.brainmathstorieRow}>
              <Text style={styles.brainmathstorieRowLabel}>Vibration</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  brainmathstorieToggleVibration(!brainmathstorieVibration)
                }>
                <Image
                  source={
                    brainmathstorieVibration
                      ? require('../../elements/i/brainmathsatogon.png')
                      : require('../../elements/i/brainmathsactogof.png')
                  }
                />
              </TouchableOpacity>
            </View>

            <Pressable
              onPress={() => setBrainmathstorieResetOpen(true)}
              style={styles.brainmathstorieRow}
              hitSlop={10}>
              <Text style={styles.brainmathstorieRowLabel}>Reset Progress</Text>
              <Image source={require('../../elements/i/brainmathsacres.png')} />
            </Pressable>

            {Platform.OS === 'ios' && (
              <Pressable onPress={brainmathstorieShareApp} hitSlop={10}>
                <LinearGradient
                  colors={['#8B5CFF', '#FF3EDB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.brainmathstorieShareBtn}>
                  <Text style={styles.brainmathstorieShareText}>Share App</Text>
                  <Image
                    source={require('../../elements/i/brainmathsacshr.png')}
                  />
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </LinearGradient>

        <Modal
          visible={brainmathstorieResetOpen}
          statusBarTranslucent={Platform.OS === 'android'}
          transparent
          animationType="fade"
          onRequestClose={() => setBrainmathstorieResetOpen(false)}>
          <View style={styles.brainmathstorieModalBackdrop}>
            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={styles.brainmathstorieModalCard}>
              <View style={styles.brainmathstorieCardInner}>
                <Text style={styles.brainmathstorieModalTitle}>
                  Reset Progress?
                </Text>
                <Text style={styles.brainmathstorieModalText}>
                  This will erase all your progress, achievements, and completed
                  tasks.
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.brainmathstorieModalActions}>
              <Pressable
                onPress={brainmathstorieResetProgress}
                style={[
                  styles.brainmathstorieModalBtn,
                  styles.brainmathstorieModalBtnYes,
                ]}>
                <Text style={styles.brainmathstorieModalBtnText}>Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => setBrainmathstorieResetOpen(false)}
                style={[
                  styles.brainmathstorieModalBtn,
                  styles.brainmathstorieModalBtnNo,
                ]}>
                <Text style={styles.brainmathstorieModalBtnText}>No</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieesettgs;

const styles = StyleSheet.create({
  brainmathstorieModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  brainmathstorieModalText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 18,
    fontWeight: '600',

    textAlign: 'center',

    lineHeight: 20,
  },

  brainmathstorieScreen: {
    flex: 1,
    paddingTop: 140,
    paddingHorizontal: 24,
    paddingBottom: 120,
    justifyContent: 'center',
  },
  brainmathstorieCard: {
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieCardInner: {
    padding: 22,
  },
  brainmathstorieTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 38,
  },
  brainmathstorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  brainmathstorieRowLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  brainmathstorieResetIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  brainmathstorieShareBtn: {
    width: 200,
    height: 35,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
    marginTop: 35,
  },
  brainmathstorieShareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  brainmathstorieModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  brainmathstorieModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },

  brainmathstorieModalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    width: '80%',
    marginTop: 30,
  },
  brainmathstorieModalBtn: {
    width: 106,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieModalBtnYes: {
    backgroundColor: '#A90E00',
  },
  brainmathstorieModalBtnNo: {
    backgroundColor: '#08A900',
  },
  brainmathstorieModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
