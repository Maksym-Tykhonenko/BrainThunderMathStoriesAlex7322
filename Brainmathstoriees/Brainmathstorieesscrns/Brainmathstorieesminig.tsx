import Sound from 'react-native-sound';
import Orientation from 'react-native-orientation-locker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';
import {useStore} from '../Brainmathstoriestorg/Brainmathstoriecntx';

type BrainmathstorieMiniGameStage = 'intro' | 'play' | 'paused' | 'gameover';
type BrainmathstorieMiniGameFeedback = 'wrongtap' | null;

type BrainmathstorieMiniGameTask = {
  title: string;
  predicate: (n: number) => boolean;
};

type BrainmathstorieMiniGameBubble = {
  id: string;
  value: number;
  x: number;
  y: Animated.Value;
  startY: number;
  bottomY: number;
  durationMs: number;
};

const {width: brainmathstorieScreenW, height: brainmathstorieScreenH} =
  Dimensions.get('window');

function brainmathstorieRandInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function brainmathstorieIsEven(n: number) {
  return n % 2 === 0;
}

function brainmathstorieIsOdd(n: number) {
  return n % 2 !== 0;
}

function brainmathstorieEndsWith(n: number, digits: number[]) {
  const d = Math.abs(n) % 10;
  return digits.includes(d);
}

function brainmathstorieBetween(n: number, a: number, b: number) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return n > lo && n < hi;
}

function brainmathstorieDivisibleBy(n: number, d: number) {
  return d !== 0 && n % d === 0;
}

function brainmathstorieEvalExpr(expr: string): number | null {
  const cleaned = expr.replace(/\s/g, '');
  const m = cleaned.match(/^(\d+)([+\-−×*÷/])(\d+)$/);
  if (!m) {
    return null;
  }
  const a = Number(m[1]);
  const op = m[2];
  const b = Number(m[3]);
  switch (op) {
    case '+':
      return a + b;
    case '-':
    case '−':
      return a - b;
    case '*':
    case '×':
      return a * b;
    case '/':
    case '÷':
      return b === 0 ? null : Math.floor(a / b);
    default:
      return null;
  }
}

function brainmathstorieMakeTapTask(text: string): BrainmathstorieMiniGameTask {
  const t = text.trim();

  const between = t.match(/Tap numbers between (\d+) and (\d+)/i);
  if (between) {
    const a = Number(between[1]);
    const b = Number(between[2]);
    return {title: t, predicate: n => brainmathstorieBetween(n, a, b)};
  }

  const gtlt = t.match(/Tap numbers greater than (\d+) and less than (\d+)/i);
  if (gtlt) {
    const a = Number(gtlt[1]);
    const b = Number(gtlt[2]);
    return {title: t, predicate: n => n > a && n < b};
  }

  const less = t.match(/Tap numbers less than (\d+)/i);
  if (less) {
    const x = Number(less[1]);
    return {title: t, predicate: n => n < x};
  }

  const greater = t.match(/Tap numbers greater than (\d+)/i);
  if (greater) {
    const x = Number(greater[1]);
    return {title: t, predicate: n => n > x};
  }

  const equal = t.match(/Tap numbers equal to (\d+)/i);
  if (equal) {
    const x = Number(equal[1]);
    return {title: t, predicate: n => n === x};
  }

  const divisible = t.match(/Tap numbers divisible by (\d+)/i);
  if (divisible) {
    const d = Number(divisible[1]);
    return {title: t, predicate: n => brainmathstorieDivisibleBy(n, d)};
  }

  const ends0 = t.match(/Tap numbers ending in (\d+)/i);
  if (ends0) {
    const d = Number(ends0[1]);
    return {title: t, predicate: n => brainmathstorieEndsWith(n, [d])};
  }

  const endsOr = t.match(/Tap numbers ending in ([0-9, ]+)/i);
  if (endsOr) {
    const digits = endsOr[1]
      .split(',')
      .map(s => Number(s.trim()))
      .filter(x => Number.isFinite(x));
    if (digits.length) {
      return {title: t, predicate: n => brainmathstorieEndsWith(n, digits)};
    }
  }

  const endsSet = t.match(/Tap numbers ending in ([0-9](?:,\s*[0-9])*)/i);
  if (endsSet) {
    const digits = endsSet[1]
      .split(',')
      .map(s => Number(s.trim()))
      .filter(x => Number.isFinite(x));
    if (digits.length) {
      return {title: t, predicate: n => brainmathstorieEndsWith(n, digits)};
    }
  }

  if (/Tap only even numbers/i.test(t)) {
    return {title: t, predicate: brainmathstorieIsEven};
  }
  if (/Tap only odd numbers/i.test(t)) {
    return {title: t, predicate: brainmathstorieIsOdd};
  }

  return {title: t, predicate: brainmathstorieIsEven};
}

const brainmathstorieBaseTasksText = [
  'Tap only even numbers',
  'Tap only odd numbers',
  'Tap numbers less than 10',
  'Tap numbers greater than 10',
  'Tap numbers equal to 5',
  'Tap numbers divisible by 2',
  'Tap numbers divisible by 3',
  'Tap numbers ending in 0',
  'Tap numbers ending in 5',
  'Tap numbers between 3 and 8',
  'Tap numbers less than 5',
  'Tap numbers greater than 15',
  'Tap numbers equal to 10',
  'Tap numbers divisible by 4',
  'Tap numbers divisible by 5',
  'Tap numbers ending in 2',
  'Tap numbers ending in 8',
  'Tap numbers between 1 and 6',
  'Tap numbers between 7 and 12',
  'Tap numbers greater than 3 and less than 9',
];

const brainmathstorieConditionalTasksText = [
  'If 2+2 is even, tap even numbers',
  'If 3+2 is odd, tap odd numbers',
  'If 5+5 is even, tap odd numbers',
  'If 4+1 is odd, tap numbers less than 10',
  'If 6+2 is even, tap numbers greater than 5',
  'If 3×2 is even, tap even numbers',
  'If 3×3 is odd, tap odd numbers',
  'If 10−5 is odd, tap numbers less than 7',
  'If 8−4 is even, tap numbers greater than 6',
  'If 9−3 is even, tap numbers divisible by 2',
  'If 2+3 is odd, tap even numbers',
  'If 4+4 is even, tap odd numbers',
  'If 6+1 is odd, tap numbers greater than 4',
  'If 7+1 is even, tap numbers less than 9',
  'If 5×2 is even, tap numbers divisible by 5',
  'If 4×3 is even, tap numbers greater than 6',
  'If 2×2 is even, tap numbers less than 5',
  'If 9−4 is odd, tap numbers greater than 3',
  'If 8−3 is odd, tap numbers less than 8',
  'If 12−6 is even, tap numbers divisible by 2',
];

const brainmathstorieHardTasksText = [
  'If result is even, tap odd numbers',
  'If result is odd, tap even numbers',
  'If 2+3 is odd, tap numbers greater than 5',
  'If 4×2 is even, tap numbers ending in 0 or 2',
  'If 7−2 is odd, tap numbers less than 6',
  'If 6÷2 is odd, tap odd numbers',
  'If 6÷2 is even, tap even numbers',
  'If 3+3 is even, tap numbers divisible by 3',
  'If 2×5 is even, tap numbers between 5 and 10',
  'If 8−3 is odd, tap numbers ending in 1, 3, 5, 7, 9',
  'If result is even, tap numbers less than 6',
  'If result is odd, tap numbers greater than 7',
  'If 3+4 is odd, tap numbers ending in 1, 3, 5',
  'If 2×4 is even, tap numbers divisible by 4',
  'If 9−2 is odd, tap numbers between 2 and 7',
  'If 8÷2 is even, tap numbers less than 5',
  'If 10÷2 is odd, tap odd numbers',
  'If 5+5 is even, tap numbers ending in 0 or 5',
  'If 6×2 is even, tap numbers greater than 8',
  'If 7−3 is even, tap numbers divisible by 2',
];

function brainmathstorieBuildTaskFromText(
  text: string,
): BrainmathstorieMiniGameTask {
  const m = text.match(/^If (.+?) is (even|odd),\s*(tap .+)$/i);
  if (m) {
    const expr = m[1];
    const want = m[2].toLowerCase();
    const tap = m[3];

    const val =
      expr.toLowerCase() === 'result' ? null : brainmathstorieEvalExpr(expr);
    const exprVal =
      val === null
        ? brainmathstorieEvalExpr(
            `${brainmathstorieRandInt(2, 12)}+${brainmathstorieRandInt(2, 12)}`,
          )
        : val;

    const condIsEven = exprVal !== null ? brainmathstorieIsEven(exprVal) : true;
    const condOk = want === 'even' ? condIsEven : !condIsEven;

    const tapTask = brainmathstorieMakeTapTask(
      tap
        .replace(/ending in 0 or 2/i, 'ending in 0, 2')
        .replace(/ending in 0 or 5/i, 'ending in 0, 5'),
    );

    return {
      title:
        expr.toLowerCase() === 'result'
          ? `${text}`
          : `If ${expr} is ${want}, ${tapTask.title.replace(/^Tap /, 'tap ')}`,
      predicate: condOk ? tapTask.predicate : () => false,
    };
  }

  return brainmathstorieMakeTapTask(text.replace(/^If /i, 'Tap '));
}

const Brainmathstorieesminig = () => {
  const brainmathstorieNavigation = useNavigation<any>();

  const BRAINMATHSTORIEES_DAILY_KEY = 'brainmathstoriees.dailyChallenge.v1';
  const brainmathstorieTodayKey = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [brainmathstorieStage, setBrainmathstorieStage] =
    useState<BrainmathstorieMiniGameStage>('intro');
  const [brainmathstorieScore, setBrainmathstorieScore] = useState(0);
  const [brainmathstorieDifficulty, setBrainmathstorieDifficulty] = useState<
    0 | 1 | 2
  >(0);
  const [brainmathstorieCorrectStreak, setBrainmathstorieCorrectStreak] =
    useState(0);
  const [brainmathstorieTask, setBrainmathstorieTask] =
    useState<BrainmathstorieMiniGameTask>(() =>
      brainmathstorieBuildTaskFromText(brainmathstorieBaseTasksText[0]),
    );
  const brainmathstorieTaskRef = useRef<BrainmathstorieMiniGameTask | null>(
    null,
  );
  useEffect(() => {
    brainmathstorieTaskRef.current = brainmathstorieTask;
  }, [brainmathstorieTask]);

  const [brainmathstorieBubbles, setBrainmathstorieBubbles] = useState<
    BrainmathstorieMiniGameBubble[]
  >([]);
  const [brainmathstorieFeedback, setBrainmathstorieFeedback] =
    useState<BrainmathstorieMiniGameFeedback>(null);

  const brainmathstorieSpawnTimer = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const brainmathstorieIsRunningRef = useRef(false);
  const brainmathstorieIsPausedRef = useRef(false);
  const brainmathstorieSpeedRef = useRef(1); // increases gradually
  const brainmathstorieLastTaskTitleRef = useRef<string | null>(null);
  const brainmathstorieBubbleAnimatingRef = useRef<Record<string, true>>({});

  const brainmathstorieBaseTasks = useMemo(
    () => brainmathstorieBaseTasksText.map(brainmathstorieBuildTaskFromText),
    [],
  );
  const brainmathstorieConditionalTasks = useMemo(
    () =>
      brainmathstorieConditionalTasksText.map(brainmathstorieBuildTaskFromText),
    [],
  );
  const brainmathstorieHardTasks = useMemo(
    () => brainmathstorieHardTasksText.map(brainmathstorieBuildTaskFromText),
    [],
  );

  const brainmathstorieTasksPool = useMemo(() => {
    if (brainmathstorieDifficulty === 0) {
      return brainmathstorieBaseTasks;
    }
    if (brainmathstorieDifficulty === 1) {
      return brainmathstorieConditionalTasks;
    }
    return brainmathstorieHardTasks;
  }, [
    brainmathstorieBaseTasks,
    brainmathstorieConditionalTasks,
    brainmathstorieDifficulty,
    brainmathstorieHardTasks,
  ]);

  const [
    brainmathstorieBackgroundMusicIdx,
    setBrainmathstorieBackgroundMusicIdx,
  ] = useState(0);

  const [sound, setSound] = useState<Sound | null>(null);
  const brainmathstorieBackgroundMusicTracksCycle = [
    'sounovamusic-mongol-horseman-449830.mp3',
    'sounovamusic-mongol-horseman-449830.mp3',
  ];
  const {
    brainmathstorieBackgroundMusic,
    setBrainmathstorieBackgroundMusic,
    brainmathstorieVibration,
    setBrainmathstorieVibration,
  } = useStore() as any;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const bg = await AsyncStorage.getItem(
            'toggleBrainmathstorieBackgroundMusic',
          );
          const vib = await AsyncStorage.getItem(
            'toggleBrainmathstorieVibration',
          );
          setBrainmathstorieBackgroundMusic(bg ? JSON.parse(bg) : false);
          setBrainmathstorieVibration(vib ? JSON.parse(vib) : false);
        } catch {
          console.log('error');
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
          const prev = data[brainmathstorieTodayKey] ?? {};
          data[brainmathstorieTodayKey] = {...prev, gamePlayed: true};
          await AsyncStorage.setItem(
            BRAINMATHSTORIEES_DAILY_KEY,
            JSON.stringify(data),
          );
        } catch {
          console.log('error');
        }
      })();
    }, [
      brainmathstorieTodayKey,
      setBrainmathstorieBackgroundMusic,
      setBrainmathstorieVibration,
    ]),
  );

  const playBrainmathstorieBackgroundMusic = (index: number) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const brainmathstorieBackgroundMusicTrackPath =
      brainmathstorieBackgroundMusicTracksCycle[index];

    const newBrainmathstorieBackgroundMusicSound = new Sound(
      brainmathstorieBackgroundMusicTrackPath,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Error =>', error);
          return;
        }

        newBrainmathstorieBackgroundMusicSound.play(success => {
          if (success) {
            setBrainmathstorieBackgroundMusicIdx(
              prevIndex =>
                (prevIndex + 1) %
                brainmathstorieBackgroundMusicTracksCycle.length,
            );
          } else {
            console.log('Error =>');
          }
        });
        setSound(newBrainmathstorieBackgroundMusicSound);
      },
    );
  };

  useEffect(() => {
    playBrainmathstorieBackgroundMusic(brainmathstorieBackgroundMusicIdx);
  }, [brainmathstorieBackgroundMusicIdx]);

  useEffect(() => {
    const setVolumeBrainmathstorieBackgroundMusic = async () => {
      try {
        const brainmathstorieBackgroundMusicValue = await AsyncStorage.getItem(
          'toggleBrainmathstorieBackgroundMusic',
        );

        const isBrainmathstorieBackgroundMusicOn = JSON.parse(
          brainmathstorieBackgroundMusicValue ?? 'false',
        );
        setBrainmathstorieBackgroundMusic(isBrainmathstorieBackgroundMusicOn);
        if (sound) {
          sound.setVolume(isBrainmathstorieBackgroundMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error =>', error);
      }
    };

    setVolumeBrainmathstorieBackgroundMusic();
  }, [setBrainmathstorieBackgroundMusic, sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(brainmathstorieBackgroundMusic ? 1 : 0);
    }
  }, [brainmathstorieBackgroundMusic, sound]);

  const BRAINMATHSTORIEES_ACH_KEY = 'brainmathstoriees.achievements.v1';

  const brainmathstoriePersistGameRun = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(BRAINMATHSTORIEES_ACH_KEY);
      const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};

      const prevBestScore = Number(prev.bestGameScore ?? 0) || 0;
      const prevBestStreak = Number(prev.bestCorrectStreak ?? 0) || 0;

      const next = {
        ...prev,
        firstGamePlayed: true,
        bestGameScore: Math.max(prevBestScore, brainmathstorieScore),
        bestCorrectStreak: Math.max(
          prevBestStreak,
          brainmathstorieCorrectStreak,
        ),
      };
      await AsyncStorage.setItem(
        BRAINMATHSTORIEES_ACH_KEY,
        JSON.stringify(next),
      );
    } catch {
      console.log('error');
    }
  }, [brainmathstorieCorrectStreak, brainmathstorieScore]);

  const brainmathstorieStop = useCallback((opts?: {keepFeedback?: boolean}) => {
    brainmathstorieIsRunningRef.current = false;
    if (brainmathstorieSpawnTimer.current) {
      clearInterval(brainmathstorieSpawnTimer.current);
      brainmathstorieSpawnTimer.current = null;
    }
    if (!opts?.keepFeedback) {
      setBrainmathstorieFeedback(null);
    }
    setBrainmathstorieBubbles(prev => {
      prev.forEach(b => b.y.stopAnimation());
      return [];
    });
  }, []);

  // Reset mini-game UI when user switches away to another tab.
  useFocusEffect(
    useCallback(() => {
      return () => {
        brainmathstorieStop();
        setBrainmathstorieStage('intro');
        setBrainmathstorieScore(0);
        setBrainmathstorieDifficulty(0);
        setBrainmathstorieCorrectStreak(0);
        setBrainmathstorieFeedback(null);
        setBrainmathstorieBubbles([]);
        brainmathstorieIsPausedRef.current = false;
        brainmathstorieSpeedRef.current = 1;
        brainmathstorieLastTaskTitleRef.current = null;
        brainmathstorieBubbleAnimatingRef.current = {};
      };
    }, [brainmathstorieStop]),
  );

  const brainmathstorieGameOver = useCallback(() => {
    brainmathstorieStop();
    brainmathstoriePersistGameRun();
    setBrainmathstorieStage('gameover');
  }, [brainmathstoriePersistGameRun, brainmathstorieStop]);

  const brainmathstorieWrongTapGameOver = useCallback(() => {
    brainmathstorieStop({keepFeedback: true});
    brainmathstoriePersistGameRun();
    setTimeout(
      () => {
        setBrainmathstorieFeedback(null);
        setBrainmathstorieStage('gameover');
      },
      Platform.OS === 'ios' ? 2000 : 200,
    );
  }, [brainmathstoriePersistGameRun, brainmathstorieStop]);

  const brainmathstoriePickNextTask = useCallback(() => {
    const max = brainmathstorieTasksPool.length;
    if (max === 0) {
      return;
    }

    let t = brainmathstorieTasksPool[brainmathstorieRandInt(0, max - 1)];
    if (max > 1 && brainmathstorieLastTaskTitleRef.current) {
      for (let i = 0; i < 6; i++) {
        if (t.title !== brainmathstorieLastTaskTitleRef.current) {
          break;
        }
        t = brainmathstorieTasksPool[brainmathstorieRandInt(0, max - 1)];
      }
    }

    brainmathstorieLastTaskTitleRef.current = t.title;
    setBrainmathstorieTask(t);
  }, [brainmathstorieTasksPool]);

  const brainmathstorieSpawnBubble = useCallback(() => {
    const bubbleSize = 58;
    const padding = 18;
    const x = brainmathstorieRandInt(
      padding,
      Math.max(
        padding,
        Math.floor(brainmathstorieScreenW - padding - bubbleSize),
      ),
    );
    const value = brainmathstorieRandInt(0, 25);

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const startY = -bubbleSize - 10;
    const y = new Animated.Value(startY);

    const baseDuration = 3400;
    const speed = brainmathstorieSpeedRef.current;
    const duration = Math.max(850, Math.floor(baseDuration / speed));

    const bottomY = brainmathstorieScreenH - 230;
    const bubble: BrainmathstorieMiniGameBubble = {
      id,
      value,
      x,
      y,
      startY,
      bottomY,
      durationMs: duration,
    };
    setBrainmathstorieBubbles(prev => [...prev, bubble]);

    Animated.timing(y, {
      toValue: bottomY,
      duration,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (!finished) {
        return;
      }

      setBrainmathstorieBubbles(prev => prev.filter(b => b.id !== id));
      const currentTask = brainmathstorieTaskRef.current;
      const isCorrectNow = currentTask ? currentTask.predicate(value) : false;
      if (isCorrectNow && brainmathstorieIsRunningRef.current) {
        brainmathstorieGameOver();
      }
    });
  }, [brainmathstorieGameOver]);

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();

      return () => {
        Orientation.unlockAllOrientations();
      };
    }, []),
  );

  const brainmathstoriePauseBubbles = useCallback(() => {
    brainmathstorieIsPausedRef.current = true;
    brainmathstorieBubbleAnimatingRef.current = {};

    setBrainmathstorieBubbles(prev => {
      prev.forEach(b => {
        b.y.stopAnimation(v => {
          const currentY = typeof v === 'number' ? v : b.startY;
          const total = b.bottomY - b.startY;
          const progressed = total <= 0 ? 0 : (currentY - b.startY) / total;
          const clamped = Math.max(0, Math.min(1, progressed));
          const remaining = Math.max(
            200,
            Math.floor(b.durationMs * (1 - clamped)),
          );

          b.y.setValue(currentY);
          setBrainmathstorieBubbles(cur =>
            cur.map(x =>
              x.id === b.id
                ? {...x, startY: currentY, durationMs: remaining}
                : x,
            ),
          );
        });
      });
      return prev;
    });
  }, []);

  const brainmathstorieResumeBubbles = useCallback(() => {
    if (!brainmathstorieIsPausedRef.current) {
      return;
    }
    brainmathstorieIsPausedRef.current = false;

    setBrainmathstorieBubbles(prev => {
      prev.forEach(b => {
        if (brainmathstorieBubbleAnimatingRef.current[b.id]) {
          return;
        }
        brainmathstorieBubbleAnimatingRef.current[b.id] = true;

        Animated.timing(b.y, {
          toValue: b.bottomY,
          duration: b.durationMs,
          useNativeDriver: true,
        }).start(({finished}) => {
          delete brainmathstorieBubbleAnimatingRef.current[b.id];
          if (!finished) {
            return;
          }
          setBrainmathstorieBubbles(cur => cur.filter(x => x.id !== b.id));
          const currentTask = brainmathstorieTaskRef.current;
          const isCorrectNow = currentTask
            ? currentTask.predicate(b.value)
            : false;
          if (isCorrectNow && brainmathstorieIsRunningRef.current) {
            brainmathstorieGameOver();
          }
        });
      });
      return prev;
    });
  }, [brainmathstorieGameOver]);

  const brainmathstorieStartGame = useCallback(() => {
    brainmathstorieStop();
    setBrainmathstorieScore(0);
    setBrainmathstorieCorrectStreak(0);
    setBrainmathstorieDifficulty(0);
    brainmathstorieSpeedRef.current = 0.7;
    brainmathstoriePickNextTask();
    setBrainmathstorieStage('play');
    brainmathstorieIsRunningRef.current = true;

    const intervalMs = 1000;
    brainmathstorieSpawnTimer.current = setInterval(() => {
      if (!brainmathstorieIsRunningRef.current) {
        return;
      }
      brainmathstorieSpawnBubble();
      brainmathstorieSpeedRef.current = Math.min(
        3.6,
        brainmathstorieSpeedRef.current + 0.015,
      );
    }, intervalMs);
  }, [
    brainmathstoriePickNextTask,
    brainmathstorieSpawnBubble,
    brainmathstorieStop,
  ]);

  const brainmathstorieOnTapBubble = useCallback(
    (bubble: BrainmathstorieMiniGameBubble) => {
      if (brainmathstorieStage !== 'play') {
        return;
      }
      if (!brainmathstorieIsRunningRef.current) {
        return;
      }

      setBrainmathstorieBubbles(prev => prev.filter(b => b.id !== bubble.id));
      bubble.y.stopAnimation();

      const currentTask = brainmathstorieTaskRef.current;
      const isCorrectNow = currentTask
        ? currentTask.predicate(bubble.value)
        : false;
      if (!isCorrectNow) {
        if (brainmathstorieVibration) {
          try {
            Vibration.vibrate(120);
          } catch {
            console.log('Error =>');
          }
        }
        setBrainmathstorieFeedback('wrongtap');
        brainmathstorieWrongTapGameOver();
        return;
      }

      setBrainmathstorieScore(s => s + 1);
      setBrainmathstorieCorrectStreak(s => {
        const next = s + 1;
        if (next % 10 === 0) {
          setBrainmathstorieDifficulty(d =>
            d < 2 ? ((d + 1) as 0 | 1 | 2) : d,
          );
          brainmathstoriePickNextTask();
        }
        return next;
      });
    },
    [
      brainmathstorieVibration,
      brainmathstoriePickNextTask,
      brainmathstorieStage,
      brainmathstorieWrongTapGameOver,
    ],
  );

  useEffect(() => {
    return () => {
      brainmathstorieStop();
    };
  }, [brainmathstorieStop]);

  return (
    <Brainmathstorieelay>
      <View style={styles.brainmathstorieScreen}>
        {brainmathstorieFeedback !== null && (
          <View pointerEvents="none" style={styles.brainmathstorieFeedbackWrap}>
            <Image
              source={require('../../elements/i/brainmathstredl.gif')}
              style={{width: 520, height: 520}}
            />
          </View>
        )}

        <View style={styles.brainmathstorieHeader}>
          {brainmathstorieStage !== 'gameover' && (
            <Text style={styles.brainmathstorieHeaderTitle}>
              {brainmathstorieStage === 'intro'
                ? 'Mini Game'
                : `Score: ${brainmathstorieScore}`}
            </Text>
          )}

          {brainmathstorieStage === 'paused' && (
            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={[styles.brainmathstorieRuleCard, {marginTop: 18}]}>
              <View style={styles.brainmathstorieGradientInnerPad}>
                <Text style={styles.brainmathstorieRuleText}>
                  {brainmathstorieTask.title}
                </Text>
              </View>
            </LinearGradient>
          )}
        </View>

        {brainmathstorieStage === 'intro' && (
          <View style={styles.brainmathstorieIntroWrap}>
            <Image
              source={require('../../elements/i/brainmathsming.png')}
              style={{marginBottom: -50}}
            />

            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={[
                styles.brainmathstorieIntroCard,
                {minHeight: 160, justifyContent: 'center'},
              ]}>
              <View style={styles.brainmathstorieGradientInnerPad}>
                <Text style={styles.brainmathstorieIntroTitle}>
                  Focus and React
                </Text>
                <Text style={styles.brainmathstorieIntroText}>
                  Each round has a rule. Follow it carefully and stay in
                  control. Every tap matters.
                </Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={brainmathstorieStartGame}
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

        {brainmathstorieStage === 'play' && (
          <View style={styles.brainmathstoriePlaWrap}>
            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={styles.brainmathstorieRuleCard}>
              <View style={styles.brainmathstorieGradientInnerPad}>
                <Text style={styles.brainmathstorieRuleText}>
                  {brainmathstorieTask.title}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.brainmathstoriePlayArea}>
              {brainmathstorieBubbles.map(b => (
                <Pressable
                  key={b.id}
                  onPress={() => brainmathstorieOnTapBubble(b)}
                  style={[styles.brainmathstorieBubbleTapArea, {left: b.x}]}>
                  <Animated.View style={[{transform: [{translateY: b.y}]}]}>
                    <ImageBackground
                      source={require('../../elements/i/brainmathsball.png')}
                      style={{
                        width: 58,
                        height: 58,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.brainmathstorieBubbleText}>
                        {b.value}
                      </Text>
                    </ImageBackground>
                  </Animated.View>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                brainmathstorieIsRunningRef.current = false;
                brainmathstoriePauseBubbles();
                setBrainmathstorieStage('paused');
              }}
              style={[
                styles.brainmathstoriePrimaryBtnOuter,
                {
                  position: 'absolute',
                  bottom: 20,
                  alignSelf: 'center',
                },
              ]}>
              <LinearGradient
                colors={['#8B5CFF', '#FF3EDB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.brainmathstoriePrimaryBtn}>
                <Text style={styles.brainmathstoriePrimaryBtnText}>Pause</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          statusBarTranslucent={Platform.OS === 'android'}
          visible={brainmathstorieStage === 'paused'}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setBrainmathstorieStage('play');
            brainmathstorieIsRunningRef.current = true;
            brainmathstorieResumeBubbles();
          }}>
          <View style={styles.brainmathstorieModalBackdrop}>
            <View style={styles.brainmathstorieGradientInnerPad}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setBrainmathstorieStage('play');
                  brainmathstorieIsRunningRef.current = true;
                  brainmathstorieResumeBubbles();
                }}
                style={styles.brainmathstoriePrimaryBtnOuter}>
                <LinearGradient
                  colors={['#8B5CFF', '#FF3EDB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.brainmathstoriePrimaryBtn}>
                  <Text style={styles.brainmathstoriePrimaryBtnText}>
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {brainmathstorieStage === 'gameover' && (
          <View style={styles.brainmathstorieIntroWrap}>
            <Image
              source={require('../../elements/i/brainmathstqres.png')}
              style={{marginBottom: -50}}
            />

            <LinearGradient
              colors={['#6A00FF', '#2A1460']}
              style={[
                styles.brainmathstorieIntroCard,
                {minHeight: 160, justifyContent: 'center'},
              ]}>
              <View style={styles.brainmathstorieGradientInnerPad}>
                <Text style={styles.brainmathstorieIntroTitle}>
                  Almost there
                </Text>
                <Text style={styles.brainmathstorieIntroText}>
                  Your result: {brainmathstorieScore}. Try again and improve.
                </Text>
              </View>
            </LinearGradient>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                brainmathstorieNavigation.navigate('Brainmathstorieeslgnds')
              }
              style={styles.brainmathstoriePrimaryBtnOuter}>
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
              onPress={brainmathstorieStartGame}
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
      </View>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieesminig;

const styles = StyleSheet.create({
  brainmathstorieFeedbackWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  },
  brainmathstorieFeedbackGif: {
    width: 260,
    height: 260,
  },
  brainmathstorieHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brainmathstorieScreen: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 90,
  },

  brainmathstorieHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  brainmathstorieGradientInnerPad: {
    padding: 16,
  },

  brainmathstorieIntroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainmathstorieIntroHero: {
    width: '86%',
    height: 320,
  },
  brainmathstorieIntroCard: {
    width: '90%',
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieIntroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  brainmathstorieIntroText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  brainmathstoriePrimaryBtnOuter: {
    width: 172,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 3,
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
  brainmathstoriePrimaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  brainmathstoriePlaWrap: {
    flex: 1,
  },
  brainmathstorieRuleCard: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 18,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieRuleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  brainmathstoriePlayArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  brainmathstorieBubbleTapArea: {
    position: 'absolute',
    top: 0,
    width: 70,
    height: '100%',
  },

  brainmathstorieBubbleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  brainmathstorieModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 94,
  },
  brainmathstorieLeaveCard: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 22,
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  brainmathstorieLeaveTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
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
});
