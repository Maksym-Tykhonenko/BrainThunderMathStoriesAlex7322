import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import React, {useCallback, useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

const Brainmathstorieesacvm = () => {
  const BRAINMATHSTORIEES_ACH_KEY = 'brainmathstoriees.achievements.v1';
  const BRAINMATHSTORIEES_DAILY_KEY = 'brainmathstoriees.dailyChallenge.v1';

  const [brainmathstorieAch, setBrainmathstorieAch] = useState<{
    firstGamePlayed: boolean;
    bestGameScore: number;
    bestCorrectStreak: number;
    bestQuizScore: number;
    perfectQuizCount: number;
    completedDailyDays: number;
    dailyStreak: number;
  }>({
    firstGamePlayed: false,
    bestGameScore: 0,
    bestCorrectStreak: 0,
    bestQuizScore: 0,
    perfectQuizCount: 0,
    completedDailyDays: 0,
    dailyStreak: 0,
  });

  const brainmathstorieLoad = useCallback(async () => {
    let firstGamePlayed = false;
    let bestGameScore = 0;
    let bestCorrectStreak = 0;
    let bestQuizScore = 0;
    let perfectQuizCount = 0;

    try {
      const raw = await AsyncStorage.getItem(BRAINMATHSTORIEES_ACH_KEY);
      const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      firstGamePlayed = !!prev.firstGamePlayed;
      bestGameScore = Number(prev.bestGameScore ?? 0) || 0;
      bestCorrectStreak = Number(prev.bestCorrectStreak ?? 0) || 0;
      bestQuizScore = Number(prev.bestQuizScore ?? 0) || 0;
      perfectQuizCount = Number(prev.perfectQuizCount ?? 0) || 0;
    } catch {
      console.log('error');
    }

    let completedDailyDays = 0;
    let dailyStreak = 0;
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

      completedDailyDays = Object.values(data).filter(
        d => !!d.legendRead && !!d.gamePlayed && !!d.quizCompleted,
      ).length;

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
        dailyStreak++;
      }
    } catch {
      console.log('error');
    }

    setBrainmathstorieAch({
      firstGamePlayed,
      bestGameScore,
      bestCorrectStreak,
      bestQuizScore,
      perfectQuizCount,
      completedDailyDays,
      dailyStreak,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      brainmathstorieLoad();
    }, [brainmathstorieLoad]),
  );

  type BrainmathstorieAchCard = {
    id: string;
    title: string;
    subtitle: string;
    current: number;
    goal: number;
    image: ImageSourcePropType;
  };

  const brainmathstorieCards: BrainmathstorieAchCard[] = useMemo(
    () => [
      {
        id: 'wind-whisper',
        title: 'Wind Whisper',
        subtitle: 'Start your first game',
        current: brainmathstorieAch.firstGamePlayed ? 1 : 0,
        goal: 1,
        image: require('../../elements/i/brainmathsachv1.png'),
      },
      {
        id: 'silent-bond',
        title: 'Silent Bond',
        subtitle: 'Complete 5 challenges',
        current: Math.min(brainmathstorieAch.completedDailyDays, 5),
        goal: 5,
        image: require('../../elements/i/brainmathsachv2.png'),
      },
      {
        id: 'eagle-eye',
        title: 'Eagle Eye',
        subtitle: 'Get 5 correct answers in a row',
        current: brainmathstorieAch.bestCorrectStreak >= 5 ? 1 : 0,
        goal: 1,
        image: require('../../elements/i/brainmathsachv3.png'),
      },
      {
        id: 'inner-fire',
        title: 'Inner Fire',
        subtitle: 'Reach 50 score in one run',
        current: brainmathstorieAch.bestGameScore >= 50 ? 1 : 0,
        goal: 1,
        image: require('../../elements/i/brainmathsachv4.png'),
      },
      {
        id: 'true-aim',
        title: 'True Aim',
        subtitle: 'Answer 10 questions correctly',
        current: brainmathstorieAch.bestQuizScore >= 10 ? 1 : 0,
        goal: 1,
        image: require('../../elements/i/brainmathsachv5.png'),
      },
      {
        id: 'step-by-step',
        title: 'Step by Step',
        subtitle: 'Complete daily challenges 7 days in a row',
        current: Math.min(brainmathstorieAch.dailyStreak, 7),
        goal: 7,
        image: require('../../elements/i/brainmathsachv6.png'),
      },
    ],
    [brainmathstorieAch],
  );

  return (
    <Brainmathstorieelay>
      <View style={styles.brainmathstorieScreen}>
        <Text style={styles.brainmathstorieHeaderTitle}>Achievements</Text>

        <FlatList
          data={brainmathstorieCards}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.brainmathstorieGridRow}
          contentContainerStyle={styles.brainmathstorieGrid}
          renderItem={({item}) => {
            const ratio =
              item.goal === 0 ? 0 : Math.min(1, item.current / item.goal);
            const text = `${Math.min(item.current, item.goal)}/${item.goal}`;
            const fillPct = ratio <= 0 ? 0 : Math.max(0.06, ratio) * 99;

            return (
              <LinearGradient
                colors={['#6A00FF', '#2A1460']}
                style={styles.brainmathstorieCard}>
                <View
                  style={{
                    padding: 10,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={item.image}
                    style={{
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}
                  />
                  <Text style={styles.brainmathstorieCardTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.brainmathstorieCardSubtitle}>
                    {item.subtitle}
                  </Text>
                  <View style={styles.brainmathstorieProgressOuter}>
                    <View
                      style={[
                        styles.brainmathstorieProgressFill,
                        {width: `${fillPct}%`},
                      ]}
                    />
                    <Text style={styles.brainmathstorieProgressText}>
                      {text}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieesacvm;

const styles = StyleSheet.create({
  brainmathstorieCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  brainmathstorieCardSubtitle: {
    color: 'rgb(255, 255, 255)',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
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
    marginBottom: 24,
  },

  brainmathstorieGrid: {
    paddingBottom: 10,
    gap: 14,
  },
  brainmathstorieGridRow: {
    gap: 14,
  },

  brainmathstorieCard: {
    flex: 1,
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },

  brainmathstorieProgressOuter: {
    width: '90%',
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#8B5CFF',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  brainmathstorieProgressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 13,
    margin: 1,

    backgroundColor: '#18A300',
  },
  brainmathstorieProgressText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
