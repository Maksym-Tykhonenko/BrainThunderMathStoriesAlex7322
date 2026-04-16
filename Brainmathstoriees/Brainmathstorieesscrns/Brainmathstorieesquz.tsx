import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';
import {useStore} from '../Brainmathstoriestorg/Brainmathstoriecntx';

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useCallback, useMemo, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

type BrainmathstorieQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const brainmathstorieQuizQuestions: BrainmathstorieQuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which number is even?',
    options: ['3', '5', '8', '7'],
    correctIndex: 2,
  },
  {
    id: 'q2',
    question: 'Which number is odd?',
    options: ['2', '4', '6', '9'],
    correctIndex: 3,
  },
  {
    id: 'q3',
    question: 'Which number is divisible by 2?',
    options: ['7', '11', '10', '9'],
    correctIndex: 2,
  },
  {
    id: 'q4',
    question: 'Which number is less than 5?',
    options: ['6', '7', '4', '8'],
    correctIndex: 2,
  },
  {
    id: 'q5',
    question: 'Which number is greater than 10?',
    options: ['8', '9', '11', '7'],
    correctIndex: 2,
  },
  {
    id: 'q6',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
  },
  {
    id: 'q7',
    question: 'What is 5 + 3?',
    options: ['7', '6', '8', '9'],
    correctIndex: 2,
  },
  {
    id: 'q8',
    question: 'What is 10 − 4?',
    options: ['5', '6', '7', '8'],
    correctIndex: 1,
  },
  {
    id: 'q9',
    question: 'What is 3 × 2?',
    options: ['5', '6', '7', '8'],
    correctIndex: 1,
  },
  {
    id: 'q10',
    question: 'What is 8 ÷ 2?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
  },
  {
    id: 'q11',
    question: 'Which number is even?',
    options: ['1', '3', '6', '9'],
    correctIndex: 2,
  },
  {
    id: 'q12',
    question: 'Which number is odd?',
    options: ['10', '12', '13', '14'],
    correctIndex: 2,
  },
  {
    id: 'q13',
    question: 'Which number ends with 0?',
    options: ['12', '20', '21', '22'],
    correctIndex: 1,
  },
  {
    id: 'q14',
    question: 'Which number ends with 5?',
    options: ['15', '12', '18', '22'],
    correctIndex: 0,
  },
  {
    id: 'q15',
    question: 'What is 7 − 3?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
  },
  {
    id: 'q16',
    question: 'What is 4 + 6?',
    options: ['9', '10', '11', '12'],
    correctIndex: 1,
  },
  {
    id: 'q17',
    question: 'What is 3 × 3?',
    options: ['6', '7', '8', '9'],
    correctIndex: 3,
  },
  {
    id: 'q18',
    question: 'What is 9 ÷ 3?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
  },
  {
    id: 'q19',
    question: 'Which is greater?',
    options: ['4', '7', '3', '2'],
    correctIndex: 1,
  },
  {
    id: 'q20',
    question: 'Which is smaller?',
    options: ['9', '8', '2', '6'],
    correctIndex: 2,
  },
  {
    id: 'q21',
    question: 'What is 5 + 5?',
    options: ['8', '9', '10', '11'],
    correctIndex: 2,
  },
  {
    id: 'q22',
    question: 'What is 6 − 2?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
  },
  {
    id: 'q23',
    question: 'What is 2 × 5?',
    options: ['8', '9', '10', '12'],
    correctIndex: 2,
  },
  {
    id: 'q24',
    question: 'What is 12 ÷ 4?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
  },
  {
    id: 'q25',
    question: 'Which number is natural?',
    options: ['-1', '0', '3', '-5'],
    correctIndex: 2,
  },
  {
    id: 'q26',
    question: 'Which number is NOT natural?',
    options: ['1', '2', '0', '5'],
    correctIndex: 2,
  },
  {
    id: 'q27',
    question: 'Which number is even?',
    options: ['14', '15', '17', '19'],
    correctIndex: 0,
  },
  {
    id: 'q28',
    question: 'Which number is odd?',
    options: ['20', '22', '25', '24'],
    correctIndex: 2,
  },
  {
    id: 'q29',
    question: 'What is 1 + 0?',
    options: ['0', '1', '2', '3'],
    correctIndex: 1,
  },
  {
    id: 'q30',
    question: 'What is 0 + 5?',
    options: ['0', '3', '5', '6'],
    correctIndex: 2,
  },
  {
    id: 'q31',
    question: 'Which is equal to 4?',
    options: ['2+1', '2+2', '3+2', '5+1'],
    correctIndex: 1,
  },
  {
    id: 'q32',
    question: 'Which is greater than 6?',
    options: ['5', '6', '7', '4'],
    correctIndex: 2,
  },
  {
    id: 'q33',
    question: 'Which is less than 3?',
    options: ['1', '3', '4', '5'],
    correctIndex: 0,
  },
  {
    id: 'q34',
    question: 'What is 3 + 4?',
    options: ['6', '7', '8', '9'],
    correctIndex: 1,
  },
  {
    id: 'q35',
    question: 'What is 10 − 7?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
  },
  {
    id: 'q36',
    question: 'What is 2 × 3?',
    options: ['4', '5', '6', '7'],
    correctIndex: 2,
  },
  {
    id: 'q37',
    question: 'What is 6 ÷ 3?',
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
  },
  {
    id: 'q38',
    question: 'Which number follows the pattern: 2, 4, 6, ?',
    options: ['7', '8', '9', '10'],
    correctIndex: 1,
  },
  {
    id: 'q39',
    question: 'Which number follows: 1, 3, 5, ?',
    options: ['6', '7', '8', '9'],
    correctIndex: 1,
  },
  {
    id: 'q40',
    question: 'Which number follows: 5, 10, 15, ?',
    options: ['18', '20', '22', '25'],
    correctIndex: 1,
  },
  {
    id: 'q41',
    question: 'Which is even?',
    options: ['11', '13', '16', '17'],
    correctIndex: 2,
  },
  {
    id: 'q42',
    question: 'Which is odd?',
    options: ['18', '20', '21', '22'],
    correctIndex: 2,
  },
  {
    id: 'q43',
    question: 'What is 4 + 4?',
    options: ['6', '7', '8', '9'],
    correctIndex: 2,
  },
  {
    id: 'q44',
    question: 'What is 9 − 5?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
  },
  {
    id: 'q45',
    question: 'What is 3 × 4?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
  },
  {
    id: 'q46',
    question: 'What is 8 ÷ 4?',
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
  },
  {
    id: 'q47',
    question: 'Which number is between 5 and 10?',
    options: ['4', '5', '7', '10'],
    correctIndex: 2,
  },
  {
    id: 'q48',
    question: 'Which number is divisible by 3?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
  },
  {
    id: 'q49',
    question: 'Which is equal to 6?',
    options: ['2+3', '3+3', '4+3', '5+2'],
    correctIndex: 1,
  },
  {
    id: 'q50',
    question: 'What is 2 + 3?',
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
  },
];

type BrainmathstorieQuizStage = 'intro' | 'question' | 'result';
type BrainmathstorieQuizFeedback = 'correct' | 'wrong' | null;

const Brainmathstorieesquz = () => {
  const brainmathstorieNavigation = useNavigation<any>();
  const {brainmathstorieVibration} = useStore() as any;

  const [brainmathstorieBatchStart, setBrainmathstorieBatchStart] = useState(0);
  const [brainmathstorieSessionQuestions, setBrainmathstorieSessionQuestions] =
    useState<BrainmathstorieQuizQuestion[]>([]);

  const [brainmathstorieStage, setBrainmathstorieStage] =
    useState<BrainmathstorieQuizStage>('intro');
  const [brainmathstorieIdx, setBrainmathstorieIdx] = useState(0);
  const [brainmathstorieSelectedIdx, setBrainmathstorieSelectedIdx] = useState<
    number | null
  >(null);
  const [brainmathstorieScore, setBrainmathstorieScore] = useState(0);
  const [brainmathstorieSubmitted, setBrainmathstorieSubmitted] =
    useState(false);
  const [brainmathstorieShowLeave, setBrainmathstorieShowLeave] =
    useState(false);
  const [brainmathstorieFeedback, setBrainmathstorieFeedback] =
    useState<BrainmathstorieQuizFeedback>(null);

  const BRAINMATHSTORIEES_ACH_KEY = 'brainmathstoriees.achievements.v1';

  const brainmathstorieQuestion = useMemo(
    () => brainmathstorieSessionQuestions[brainmathstorieIdx],
    [brainmathstorieIdx, brainmathstorieSessionQuestions],
  );

  useFocusEffect(
    useCallback(() => {
      brainmathstorieReset();
    }, []),
  );

  const brainmathstorieReset = () => {
    setBrainmathstorieStage('intro');
    setBrainmathstorieIdx(0);
    setBrainmathstorieSelectedIdx(null);
    setBrainmathstorieScore(0);
    setBrainmathstorieSubmitted(false);
    setBrainmathstorieShowLeave(false);
    setBrainmathstorieFeedback(null);
  };

  const brainmathstorieStart = () => {
    const brainmathstorieBatchSize = 10;
    const brainmathstorieAll = brainmathstorieQuizQuestions;
    const brainmathstorieStartIdx =
      brainmathstorieBatchStart % brainmathstorieAll.length;
    const brainmathstorieEndIdx =
      brainmathstorieStartIdx + brainmathstorieBatchSize;
    const brainmathstorieBatch =
      brainmathstorieEndIdx <= brainmathstorieAll.length
        ? brainmathstorieAll.slice(
            brainmathstorieStartIdx,
            brainmathstorieEndIdx,
          )
        : [
            ...brainmathstorieAll.slice(brainmathstorieStartIdx),
            ...brainmathstorieAll.slice(
              0,
              brainmathstorieEndIdx - brainmathstorieAll.length,
            ),
          ];

    setBrainmathstorieSessionQuestions(brainmathstorieBatch);
    setBrainmathstorieBatchStart(
      (brainmathstorieStartIdx + brainmathstorieBatchSize) %
        brainmathstorieAll.length,
    );
    setBrainmathstorieStage('question');
    setBrainmathstorieIdx(0);
    setBrainmathstorieSelectedIdx(null);
    setBrainmathstorieScore(0);
    setBrainmathstorieSubmitted(false);
    setBrainmathstorieFeedback(null);
  };

  const brainmathstorieOnConfirm = () => {
    if (brainmathstorieSubmitted) {
      return;
    }
    if (brainmathstorieSelectedIdx === null) {
      return;
    }

    setBrainmathstorieSubmitted(true);
    const brainmathstorieIsCorrect =
      brainmathstorieSelectedIdx === brainmathstorieQuestion.correctIndex;
    setBrainmathstorieFeedback(brainmathstorieIsCorrect ? 'correct' : 'wrong');
    if (!brainmathstorieIsCorrect && brainmathstorieVibration) {
      try {
        Vibration.vibrate(120);
      } catch {
        console.log('error');
      }
    }
    if (brainmathstorieIsCorrect) {
      setBrainmathstorieScore(s => s + 1);
    }

    setTimeout(() => {
      setBrainmathstorieFeedback(null);
      const brainmathstorieNextIdx = brainmathstorieIdx + 1;
      if (brainmathstorieNextIdx >= brainmathstorieSessionQuestions.length) {
        setBrainmathstorieStage('result');
        (async () => {
          try {
            const raw = await AsyncStorage.getItem(BRAINMATHSTORIEES_ACH_KEY);
            const prev = raw
              ? (JSON.parse(raw) as Record<string, unknown>)
              : {};
            const prevBestQuiz = Number(prev.bestQuizScore ?? 0) || 0;
            const next = {
              ...prev,
              bestQuizScore: Math.max(prevBestQuiz, brainmathstorieScore),
              perfectQuizCount:
                (Number(prev.perfectQuizCount ?? 0) || 0) +
                (brainmathstorieScore === 10 ? 1 : 0),
            };
            await AsyncStorage.setItem(
              BRAINMATHSTORIEES_ACH_KEY,
              JSON.stringify(next),
            );
          } catch {
            console.log('error');
          }
        })();
        setBrainmathstorieSelectedIdx(null);
        setBrainmathstorieSubmitted(false);
        return;
      }
      setBrainmathstorieIdx(brainmathstorieNextIdx);
      setBrainmathstorieSelectedIdx(null);
      setBrainmathstorieSubmitted(false);
    }, 1900);
  };

  const brainmathstorieResultText = useMemo(() => {
    const brainmathstorieMax = brainmathstorieSessionQuestions.length || 10;
    if (brainmathstorieScore >= Math.ceil(brainmathstorieMax * 0.8)) {
      return 'Great work. You’re thinking fast.';
    }
    if (brainmathstorieScore >= Math.ceil(brainmathstorieMax * 0.5)) {
      return 'You’re getting better. Keep going.';
    }
    return 'Good start. Try again and improve.';
  }, [brainmathstorieScore, brainmathstorieSessionQuestions.length]);

  return (
    <Brainmathstorieelay>
      <View style={styles.brainmathstorieScreen}>
        {brainmathstorieFeedback !== null && (
          <View pointerEvents="none" style={styles.brainmathstorieFeedbackWrap}>
            <Image
              source={
                brainmathstorieFeedback === 'correct'
                  ? require('../../elements/i/brainmathsvioll.gif')
                  : require('../../elements/i/brainmathstredl.gif')
              }
              style={styles.brainmathstorieFeedbackGif}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.brainmathstorieHeader}>
          {/* <Pressable
            onPress={brainmathstorieOnBackPress}
            hitSlop={12}
            style={styles.brainmathstorieHeaderLeft}>
            <Image source={require('../../elements/i/brainmathstoback.png')} />
          </Pressable> */}

          {brainmathstorieStage !== 'result' && (
            <Text style={styles.brainmathstorieHeaderTitle}>
              {brainmathstorieStage === 'question'
                ? `Score: ${brainmathstorieScore}`
                : 'Quiz'}
            </Text>
          )}
        </View>

        {brainmathstorieStage === 'intro' && (
          <View style={styles.brainmathstorieIntroWrap}>
            <Image
              source={require('../../elements/i/brainmathstqz.png')}
              style={{top: 25}}
            />

            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={styles.brainmathstorieIntroCard}>
              <View style={{padding: 16}}>
                <Text style={styles.brainmathstorieIntroTitle}>
                  Ready for the challenge
                </Text>
                <Text style={styles.brainmathstorieIntroText}>
                  Answer carefully and trust your logic. Every choice shows how
                  you see patterns.
                </Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={brainmathstorieStart}
              style={styles.brainmathstoriePrimaryBtnOuter}>
              <LinearGradient
                colors={['#8B5CFF', '#FF3EDB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.brainmathstoriePrimaryBtn}>
                <Text style={styles.brainmathstoriePrimaryBtnText}>Start</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {brainmathstorieStage === 'question' && (
          <View style={styles.brainmathstorieQuizWrap}>
            {!!brainmathstorieQuestion && (
              <LinearGradient
                colors={['#6A00FF', '#2A1460']}
                style={styles.brainmathstorieQuestionCard}>
                <View style={{padding: 16}}>
                  <Text style={styles.brainmathstorieQuestionText}>
                    {brainmathstorieQuestion.question}
                  </Text>
                </View>
              </LinearGradient>
            )}

            <Image
              source={require('../../elements/i/brainmathstqzpl.png')}
              style={{marginTop: 20, marginBottom: 40}}
            />

            <View style={styles.brainmathstorieOptionsWrap}>
              {(brainmathstorieQuestion?.options ?? []).map((opt, i) => {
                const brainmathstorieIsSelected =
                  brainmathstorieSelectedIdx === i;
                const brainmathstorieIsCorrect =
                  i === brainmathstorieQuestion.correctIndex;
                const brainmathstorieIsWrong =
                  brainmathstorieSubmitted &&
                  brainmathstorieIsSelected &&
                  !brainmathstorieIsCorrect;

                return (
                  <Pressable
                    key={`${brainmathstorieQuestion.id}-${i}`}
                    disabled={brainmathstorieSubmitted}
                    onPress={() => setBrainmathstorieSelectedIdx(i)}
                    style={[
                      styles.brainmathstorieOption,
                      brainmathstorieIsSelected &&
                        styles.brainmathstorieOptionSelected,
                      brainmathstorieSubmitted &&
                        brainmathstorieIsCorrect &&
                        styles.brainmathstorieOptionCorrect,
                      brainmathstorieIsWrong &&
                        styles.brainmathstorieOptionWrong,
                    ]}>
                    <Text style={styles.brainmathstorieOptionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={brainmathstorieOnConfirm}
              disabled={
                brainmathstorieSelectedIdx === null || brainmathstorieSubmitted
              }
              style={styles.brainmathstoriePrimaryBtnOuter}>
              <LinearGradient
                colors={['#8B5CFF', '#FF3EDB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.brainmathstoriePrimaryBtn,
                  (brainmathstorieSelectedIdx === null ||
                    brainmathstorieSubmitted) &&
                    styles.brainmathstoriePrimaryBtnDisabled,
                ]}>
                <Text style={styles.brainmathstoriePrimaryBtnText}>
                  Confirm
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {brainmathstorieStage === 'result' && (
          <View style={styles.brainmathstorieResultWrap}>
            <Image
              source={require('../../elements/i/brainmathstqres.png')}
              style={{marginBottom: -50}}
            />

            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={styles.brainmathstorieIntroCard}>
              <View style={{padding: 16}}>
                <Text style={styles.brainmathstorieResultTitle}>
                  Almost there
                </Text>
                <Text style={styles.brainmathstorieIntroText}>
                  Your result: {brainmathstorieScore}.{' '}
                  {brainmathstorieResultText}
                </Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                brainmathstorieNavigation.navigate('Brainmathstorieeslgnds')
              }
              style={[styles.brainmathstoriePrimaryBtnOuter, {marginTop: 40}]}>
              <LinearGradient
                colors={['#8B5CFF', '#FF3EDB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.brainmathstoriePrimaryBtn}>
                <Text style={styles.brainmathstoriePrimaryBtnText}>
                  Read Legends
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setBrainmathstorieStage('question');
                setBrainmathstorieIdx(0);
                setBrainmathstorieSelectedIdx(null);
                setBrainmathstorieScore(0);
                setBrainmathstorieSubmitted(false);
              }}
              style={[styles.brainmathstoriePrimaryBtnOuter, {marginTop: 20}]}>
              <LinearGradient
                colors={['#8B5CFF', '#FF3EDB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.brainmathstoriePrimaryBtn}>
                <Text style={styles.brainmathstoriePrimaryBtnText}>
                  Try Again
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={brainmathstorieShowLeave}
          transparent
          animationType="fade"
          onRequestClose={() => setBrainmathstorieShowLeave(false)}
          statusBarTranslucent={Platform.OS === 'android'}>
          <View style={styles.brainmathstorieModalBackdrop}>
            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={styles.brainmathstorieLeaveCard}>
              <Text style={styles.brainmathstorieLeaveTitle}>
                Leave this session?
              </Text>
              <Text style={styles.brainmathstorieLeaveText}>
                Your progress will be lost.
              </Text>

              <View style={styles.brainmathstorieLeaveActions}>
                <Pressable
                  onPress={() => {
                    setBrainmathstorieShowLeave(false);
                    brainmathstorieReset();
                  }}
                  style={[
                    styles.brainmathstorieLeaveBtn,
                    styles.brainmathstorieLeaveYes,
                  ]}>
                  <Text style={styles.brainmathstorieLeaveBtnText}>Yes</Text>
                </Pressable>
                <Pressable
                  onPress={() => setBrainmathstorieShowLeave(false)}
                  style={[
                    styles.brainmathstorieLeaveBtn,
                    styles.brainmathstorieLeaveNo,
                  ]}>
                  <Text style={styles.brainmathstorieLeaveBtnText}>No</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieesquz;

const styles = StyleSheet.create({
  brainmathstorieIntroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieIntroHero: {
    width: '86%',
    height: 320,
  },

  brainmathstorieScreen: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  brainmathstorieFeedbackWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  brainmathstorieFeedbackGif: {
    width: 520,
    height: 520,
  },

  brainmathstorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginBottom: 20,
  },

  brainmathstorieHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  brainmathstorieIntroCard: {
    width: '100%',
    borderRadius: 22,

    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainmathstorieIntroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  brainmathstorieIntroText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },

  brainmathstoriePrimaryBtnOuter: {
    width: 172,
    alignSelf: 'center',
    marginTop: 55,
  },
  brainmathstoriePrimaryBtn: {
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstoriePrimaryBtnDisabled: {
    opacity: 0.55,
  },
  brainmathstoriePrimaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  brainmathstorieQuizWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brainmathstorieScore: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 4,
  },
  brainmathstorieQuestionCard: {
    width: '100%',
    borderRadius: 22,
    minHeight: 66,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,

    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieQuestionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  brainmathstorieQuizMascot: {
    width: 190,
    height: 190,
    marginVertical: 8,
  },
  brainmathstorieOptionsWrap: {
    width: '76%',
    gap: 12,
    marginTop: 6,
    marginBottom: 18,
  },
  brainmathstorieOption: {
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8B5CFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  brainmathstorieOptionSelected: {
    backgroundColor: '#8B5CFF',
  },
  brainmathstorieOptionCorrect: {
    backgroundColor: '#08A900',
  },
  brainmathstorieOptionWrong: {
    backgroundColor: '#A90E00',
  },
  brainmathstorieOptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  brainmathstorieResultWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieResultTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  brainmathstorieModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  brainmathstorieLeaveCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 22,
    padding: 18,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieLeaveTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  brainmathstorieLeaveText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  brainmathstorieLeaveActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  brainmathstorieLeaveBtn: {
    flex: 1,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieLeaveYes: {
    backgroundColor: '#8C0000',
  },
  brainmathstorieLeaveNo: {
    backgroundColor: '#0A8A0A',
  },
  brainmathstorieLeaveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
