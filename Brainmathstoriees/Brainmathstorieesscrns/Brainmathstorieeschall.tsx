import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';

import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';

const Brainmathstorieeschall = () => {
  const brainmathstorieNavigation = useNavigation<any>();

  const brainmathstorieTodayKey = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [brainmathstorieSavedIds, setBrainmathstorieSavedIds] = useState<
    Record<string, true>
  >({});
  const [brainmathstorieDaily, setBrainmathstorieDaily] = useState<{
    legendRead: boolean;
    gamePlayed: boolean;
    quizCompleted: boolean;
  }>({legendRead: false, gamePlayed: false, quizCompleted: false});
  const [brainmathstorieStreak, setBrainmathstorieStreak] = useState(0);
  const [brainmathstorieHasDailyData, setBrainmathstorieHasDailyData] =
    useState(false);

  const BRAINMATHSTORIEES_SAVED_KEY = 'brainmathstoriees.savedLegends.v1';
  const BRAINMATHSTORIEES_DAILY_KEY = 'brainmathstoriees.dailyChallenge.v1';

  const brainmathstorieDailyLegend = useMemo<{
    id: string;
    title: string;
    image: ImageSourcePropType;
  }>(
    () => ({
      id: 'balance-of-numbers',
      title: 'The Balance Of Numbers',
      image: require('../../elements/i/brainmathstorlgn1.png'),
    }),
    [],
  );

  const brainmathstorieLoad = useCallback(async () => {
    try {
      const rawSaved = await AsyncStorage.getItem(BRAINMATHSTORIEES_SAVED_KEY);
      const ids = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
      const map: Record<string, true> = {};
      ids.forEach(id => {
        map[id] = true;
      });
      setBrainmathstorieSavedIds(map);
    } catch {
      setBrainmathstorieSavedIds({});
    }

    try {
      const rawDaily = await AsyncStorage.getItem(BRAINMATHSTORIEES_DAILY_KEY);
      const data = rawDaily
        ? (JSON.parse(rawDaily) as Record<
            string,
            {
              legendRead?: boolean;
              gamePlayed?: boolean;
              quizCompleted?: boolean;
            }
          >)
        : {};
      setBrainmathstorieHasDailyData(Object.keys(data).length > 0);

      const today = data[brainmathstorieTodayKey] ?? {};
      const legendRead = !!today.legendRead;
      const gamePlayed = !!today.gamePlayed;
      const quizCompleted = !!today.quizCompleted;
      setBrainmathstorieDaily({legendRead, gamePlayed, quizCompleted});

      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        const day = data[key];
        const complete =
          !!day?.legendRead && !!day?.gamePlayed && !!day?.quizCompleted;
        if (!complete) {
          break;
        }
        streak++;
      }
      setBrainmathstorieStreak(streak);
    } catch {
      setBrainmathstorieDaily({
        legendRead: false,
        gamePlayed: false,
        quizCompleted: false,
      });
      setBrainmathstorieStreak(0);
      setBrainmathstorieHasDailyData(false);
    }
  }, [brainmathstorieTodayKey]);

  useFocusEffect(
    useCallback(() => {
      brainmathstorieLoad();
    }, [brainmathstorieLoad]),
  );

  const brainmathstorieSetDailyFlag = useCallback(
    async (flag: 'legendRead' | 'gamePlayed' | 'quizCompleted') => {
      try {
        const rawDaily = await AsyncStorage.getItem(
          BRAINMATHSTORIEES_DAILY_KEY,
        );
        const data = rawDaily
          ? (JSON.parse(rawDaily) as Record<
              string,
              {
                legendRead?: boolean;
                gamePlayed?: boolean;
                quizCompleted?: boolean;
              }
            >)
          : {};
        const prev = data[brainmathstorieTodayKey] ?? {};
        data[brainmathstorieTodayKey] = {...prev, [flag]: true};
        await AsyncStorage.setItem(
          BRAINMATHSTORIEES_DAILY_KEY,
          JSON.stringify(data),
        );
      } catch {
        console.log('error');
      } finally {
        brainmathstorieLoad();
      }
    },
    [brainmathstorieLoad, brainmathstorieTodayKey],
  );

  const brainmathstorieToggleSaved = useCallback(
    async (id: string) => {
      try {
        const rawSaved = await AsyncStorage.getItem(
          BRAINMATHSTORIEES_SAVED_KEY,
        );
        const ids = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
        const set = new Set(ids);
        if (set.has(id)) {
          set.delete(id);
        } else {
          set.add(id);
        }
        await AsyncStorage.setItem(
          BRAINMATHSTORIEES_SAVED_KEY,
          JSON.stringify(Array.from(set)),
        );
      } catch {
        console.log('error');
      } finally {
        brainmathstorieLoad();
      }
    },
    [brainmathstorieLoad],
  );

  const brainmathstorieShareLegend = useCallback(async () => {
    try {
      await Share.share({message: brainmathstorieDailyLegend.title});
    } catch {
      console.log('error');
    }
  }, [brainmathstorieDailyLegend.title]);

  const brainmathstorieStreakDisplay = Math.min(
    7,
    brainmathstorieHasDailyData ? brainmathstorieStreak : 2,
  );
  const brainmathstorieStreakText = `${brainmathstorieStreakDisplay}/7`;
  const brainmathstorieStreakProgress = brainmathstorieStreakDisplay / 7;

  return (
    <Brainmathstorieelay>
      <ScrollView
        contentContainerStyle={styles.brainmathstorieScreen}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.brainmathstorieHeaderTitle}>Daily Challenge</Text>

        <Text style={styles.brainmathstorieSectionTitle}>Your Streak</Text>
        <View style={styles.brainmathstorieStreakOuter}>
          <View
            style={[
              styles.brainmathstorieStreakFill,
              {
                width:
                  brainmathstorieStreakProgress <= 0
                    ? '0%'
                    : `${Math.max(0.06, brainmathstorieStreakProgress) * 97}%`,
              },
            ]}
          />
          <Text style={styles.brainmathstorieStreakText}>
            {brainmathstorieStreakText}
          </Text>
        </View>

        <Text style={styles.brainmathstorieSectionTitle}>Daily Legend</Text>
        <LinearGradient
          colors={['#6A00FF', '#2A1460']}
          style={styles.brainmathstorieLegendCard}>
          <View style={styles.brainmathstorieLegendInner}>
            <Image
              source={brainmathstorieDailyLegend.image}
              style={styles.brainmathstorieLegendImage}
            />
            <View style={styles.brainmathstorieLegendRight}>
              <View style={styles.brainmathstorieLegendTitleRow}>
                <Text style={styles.brainmathstorieLegendTitle}>
                  {brainmathstorieDailyLegend.title}
                </Text>
                {brainmathstorieDaily.legendRead && (
                  <Image
                    style={{
                      position: 'absolute',
                      right: -5,
                      top: -20,
                    }}
                    source={require('../../elements/i/brainmathsbcomp.png')}
                  />
                )}
              </View>

              <View style={styles.brainmathstorieLegendActions}>
                <Pressable
                  onPress={() =>
                    brainmathstorieToggleSaved(brainmathstorieDailyLegend.id)
                  }
                  hitSlop={10}>
                  <Image
                    source={
                      brainmathstorieSavedIds[brainmathstorieDailyLegend.id]
                        ? require('../../elements/i/brainmathstosavved.png')
                        : require('../../elements/i/brainmathstosave.png')
                    }
                  />
                </Pressable>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    brainmathstorieSetDailyFlag('legendRead');
                    brainmathstorieNavigation.navigate(
                      'Brainmathstorieeslgnds',
                    );
                  }}>
                  <LinearGradient
                    colors={['#8B5CFF', '#FF3EDB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.brainmathstorieReadBtn}>
                    <Text style={styles.brainmathstorieReadBtnText}>Read</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <Pressable onPress={brainmathstorieShareLegend} hitSlop={10}>
                  <Image
                    source={require('../../elements/i/brainmathstosshr.png')}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.brainmathstorieTasksWrap}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              brainmathstorieSetDailyFlag('gamePlayed');
              brainmathstorieNavigation.navigate('Brainmathstorieesminig');
            }}>
            <LinearGradient
              colors={['#FE59FC', '#560256']}
              style={styles.brainmathstorieTaskCard}>
              <View
                style={{
                  padding: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.brainmathstorieTaskText}>
                  Open the game one time today.
                </Text>
                <View>
                  <Image
                    source={
                      brainmathstorieDaily.gamePlayed
                        ? require('../../elements/i/brainmathsbcomp.png')
                        : require('../../elements/i/brainmathsbnex.png')
                    }
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              brainmathstorieSetDailyFlag('quizCompleted');
              brainmathstorieNavigation.navigate('Brainmathstorieesquz');
            }}>
            <LinearGradient
              colors={['#23CFD4', '#063847']}
              style={styles.brainmathstorieTaskCard}>
              <View
                style={{
                  padding: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.brainmathstorieTaskText}>
                  Complete quiz one time today.
                </Text>
                <View>
                  <Image
                    source={
                      brainmathstorieDaily.quizCompleted
                        ? require('../../elements/i/brainmathsbcomp.png')
                        : require('../../elements/i/brainmathsbnex.png')
                    }
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieeschall;

const styles = StyleSheet.create({
  brainmathstorieLegendActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  brainmathstorieReadBtn: {
    width: 109,
    height: 30,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieScreen: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  brainmathstorieHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 35,
  },

  brainmathstorieSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 5,
  },

  brainmathstorieStreakOuter: {
    width: '100%',
    height: 34,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5CFF',
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 2,
  },
  brainmathstorieStreakFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    margin: 3,
    backgroundColor: '#08A900',
  },
  brainmathstorieStreakText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  brainmathstorieLegendCard: {
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    marginBottom: 44,
  },
  brainmathstorieLegendInner: {
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  brainmathstorieLegendImage: {
    width: 120,
    height: 120,
    borderRadius: 18,
  },
  brainmathstorieLegendRight: {
    flex: 1,
    alignItems: 'center',
  },
  brainmathstorieLegendTitleRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brainmathstorieLegendTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    width: '80%',
  },
  brainmathstorieDoneBadge: {
    position: 'absolute',
    right: 0,
    top: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#18A300',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieDoneBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  brainmathstorieReadBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  brainmathstorieTasksWrap: {
    gap: 44,
  },
  brainmathstorieTaskCard: {
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    minHeight: 83,
    justifyContent: 'center',
  },
  brainmathstorieTaskText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    width: Platform.OS === 'ios' ? '100%' : '80%',
  },

  brainmathstorieTaskRightDone: {
    backgroundColor: '#18A300',
    borderColor: '#18A300',
  },
  brainmathstorieTaskRightText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
