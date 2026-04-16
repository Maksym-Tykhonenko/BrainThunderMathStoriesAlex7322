import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';

type BrainmathstorieesLegend = {
  id: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
};

const BRAINMATHSTORIEES_SAVED_KEY = 'brainmathstoriees.savedLegends.v1';

const brainmathstorieesLegends: BrainmathstorieesLegend[] = [
  {
    id: 'balance-of-numbers',
    title: 'The Balance Of Numbers',
    body: `Across the endless Mongolian steppe, where the wind carries ancient stories, lived a girl named Ayala. She could feel the rhythm of the world, as if every movement followed a hidden pattern. An old shaman once told her, “Everything around you follows numbers, even what you cannot see.” But to understand this, she had to learn to recognize their differences. The first she would meet were even and odd numbers.
One day, she noticed stones arranged in two neat rows. It became clear: when every stone has a pair, the number is even. But if one is left alone, the number becomes different—odd. She realized a simple truth: even numbers can be divided by two with nothing left, while odd numbers always leave something behind. It felt like balance and imbalance, harmony and its shift.
Ayala began to observe everything around her—the steps of a horse, the beats of her heart, the stars above. She saw that many things move in patterns, often built on evenness. Two steps feel steady, three create change. She understood that numbers are not just symbols, but a way to describe the world. And each number carries its own character.
Over time, she learned to recognize numbers instantly by their final digit. If a number ends in 0, 2, 4, 6, or 8—it is even. If it ends in 1, 3, 5, 7, or 9—it is odd. This became her quiet skill, allowing her to see patterns faster than others. The world began to feel more structured, more understandable.
When she returned to the shaman, he simply smiled. “Now you see the beginning,” he said. Ayala understood that mathematics is not about complex formulas, but about seeing order within chaos. Every new idea became a step forward. And with each number, the world revealed a little more of itself.`,
    image: require('../../elements/i/brainmathstorlgn1.png'),
  },
  {
    id: 'path-of-natural-numbers',
    title: 'The Path of Natural Numbers',
    body: `Ayala continued her journey across the steppe, counting everything she saw. One, two, three—each step felt like a progression forward. The shaman explained that these numbers were called natural numbers, the simplest way to count the world. They begin with one and grow endlessly. They are the foundation of everything she would learn.
She noticed how natural numbers appear everywhere—animals in a herd, days in a journey, stars she could count before sleep. These numbers always move forward, never backward. They help us measure, compare, and understand quantity. Without them, nothing could be counted or ordered.
The shaman warned her not to confuse them with nothingness. Zero is not a natural number in this path—it represents the absence of something. Natural numbers begin only when something exists. This idea helped her understand the difference between presence and absence.
As she practiced, Ayala became faster. She could instantly count groups and recognize patterns. Natural numbers gave her clarity—they were simple, direct, and reliable. They became her first true tool in understanding the world.
She realized that every complex idea begins with something simple. Natural numbers were that beginning. Step by step, they built the path forward.`,
    image: require('../../elements/i/brainmathstorlgn2.png'),
  },
  {
    id: 'power-of-comparison',
    title: 'The Power of Comparison',
    body: `One evening, Ayala faced two paths. One was long and winding, the other short and direct. She hesitated, unsure which to choose. The shaman told her, “To decide, you must compare.” That was the moment she discovered the meaning of greater and smaller.
She began to understand symbols that describe comparison: greater than, less than, equal to. These were not just signs, but decisions. If one number is larger, it holds more. If it is smaller, it holds less. If they are equal, balance is achieved.
She practiced with numbers in her mind. Five is greater than three. Two is less than seven. Four is equal to four. Each comparison became easier, faster, more natural. It was like learning a new language.
Soon, she applied this to real life—choosing the shorter path, counting resources, making decisions. Numbers were no longer abstract; they guided her actions. Comparison became a powerful tool.
Ayala understood that knowing numbers is not enough. You must also know how they relate to each other. That is where true understanding begins.`,
    image: require('../../elements/i/brainmathstorlgn3.png'),
  },
  {
    id: 'circle-of-addition',
    title: 'The Circle of Addition',
    body: `One day, Ayala gathered stones again, placing them in small groups. When she combined two groups, she noticed something new—the total changed. This was her first encounter with addition. It was the act of bringing things together.
The shaman explained that addition increases quantity. When you add, you grow. Two plus three becomes five. It is simple, but powerful. It shows how small parts can become something bigger.
Ayala practiced combining everything—steps, objects, moments. She saw that addition is everywhere. It is in growth, in accumulation, in progress. Each addition moved her forward.
She also learned that the order does not matter. Two plus three is the same as three plus two. This balance made addition feel natural, almost effortless. It followed its own logic.
She realized that addition is the beginning of change. It is how things expand and evolve. And through it, the world becomes larger.`,
    image: require('../../elements/i/brainmathstorlgn4.png'),
  },
  {
    id: 'silence-of-zero',
    title: 'The Silence of Zero',
    body: `One quiet night, Ayala sat alone, surrounded by emptiness. There were no stones, no sounds, nothing to count. She felt confused—how could nothing be part of mathematics? The shaman told her, “Even nothing has meaning.” This was her first encounter with zero.
Zero represents absence. It means there is nothing, but it still holds value in understanding. Without zero, we cannot describe emptiness. It completes the system of numbers.
She learned that adding zero changes nothing. Five plus zero remains five. It does not add or take away—it simply exists. This made zero unique among numbers.
But zero also holds power. When placed beside other numbers, it can change their value completely. Ten is not the same as one. A simple symbol can transform meaning.
Ayala understood that even emptiness has purpose. Zero is the silence between sounds, the pause between actions. And without it, the rhythm of numbers would not exist.`,
    image: require('../../elements/i/brainmathstorlgn5.png'),
  },
  {
    id: 'flow-of-subtraction',
    title: 'The Flow of Subtraction',
    body: `As Ayala continued her journey, she began to notice that not everything grows—some things disappear. One evening, a group of birds flew away, leaving fewer behind. She realized this was the opposite of addition. This was subtraction.
The shaman explained that subtraction means taking away. If you have five stones and remove two, only three remain. It is a way to understand loss, change, and reduction. Subtraction helps us see what is left.
Ayala practiced by removing objects one by one. Each time, the number became smaller. She saw how subtraction moves in the opposite direction of growth. It is just as important as addition.
She also learned that order matters here. Five minus two is not the same as two minus five. This made subtraction more precise and careful. It required attention.
Ayala understood that subtraction teaches balance. It shows that change is not only about gaining, but also about letting go.`,
    image: require('../../elements/i/brainmathstorlgn6.png'),
  },
  {
    id: 'strength-of-multiplication',
    title: 'The Strength of Multiplication',
    body: `One day, Ayala needed to count many одинаков stones quickly. Counting one by one felt too slow. The shaman showed her a new way—multiplication. It was like repeating addition in a faster form.
Instead of adding three stones again and again, she could say three times four. This means adding three four times. The result comes faster, clearer, stronger. Multiplication saves time and effort.
She began to see patterns—groups forming equal parts. Rows, columns, formations. Everything became structured. Multiplication revealed hidden order.
Ayala noticed that multiplication grows numbers quickly. Two times two is four, but two times five is ten. The increase is powerful. It expands the world rapidly.
She realized multiplication is about efficiency. It turns repetition into a simple rule. And through it, complexity becomes easier.`,
    image: require('../../elements/i/brainmathstorlgn7.png'),
  },
  {
    id: 'balance-of-division',
    title: 'The Balance of Division',
    body: `As numbers grew larger, Ayala wondered how to share them equally. The shaman introduced division—the act of splitting into equal parts. It was the opposite of multiplication.
If ten stones are shared between two people, each receives five. Division creates balance. It ensures fairness and equality. It is the art of distribution.
Ayala practiced dividing objects into groups. Sometimes it worked perfectly, sometimes something was left over. That remainder became important. Not everything divides evenly.
She learned that division asks a question: how many times does one number fit into another? It is not just splitting—it is measuring relationships. This made her think deeper.
Ayala understood that division is about fairness. It shows how things can be shared, compared, and understood through equal parts.`,
    image: require('../../elements/i/brainmathstorlgn8.png'),
  },
  {
    id: 'secret-of-patterns',
    title: 'The Secret of Patterns',
    body: `One night, Ayala watched the stars and noticed something repeating. Some patterns appeared again and again. The shaman told her, “Patterns are the language of numbers.”
She began to observe sequences—2, 4, 6, 8… Each number followed a rule. This was not random. Patterns help us predict what comes next. They reveal structure.
Ayala realized that patterns exist everywhere—in nature, in movement, in time. Numbers simply describe them. When you understand the rule, you understand the system.
She practiced finding patterns in numbers and shapes. Each discovery felt like unlocking a secret. It made the world more predictable, more logical.
She understood that patterns are the bridge between chaos and order. They show that everything follows a path.`,
    image: require('../../elements/i/brainmathstorlgn9.png'),
  },
  {
    id: 'first-equation',
    title: 'The First Equation',
    body: `One day, the shaman drew a simple line in the sand: 2 + 2 = ?. Ayala looked at it and felt something new. This was not just numbers—this was a question. It needed an answer.
He explained that this is called an equation. It shows that two sides must be equal. The answer completes the balance. Without it, the equation is unfinished.
Ayala solved it—2 + 2 = 4. The moment felt powerful. She realized equations are like puzzles. They challenge the mind to find what is missing.
She practiced with more examples, understanding that equations always seek balance. Both sides must match. This rule never changes.
Ayala saw that equations are the heart of mathematics. They bring everything together—numbers, operations, logic. And through them, the world becomes clear.`,
    image: require('../../elements/i/brainmathstorlgn10.png'),
  },
];

function BrainmathstorieesSegment({
  value,
  onChange,
}: {
  value: 'all' | 'saved';
  onChange: (v: 'all' | 'saved') => void;
}) {
  return (
    <View style={styles.brainmathstorieSegmentOuter}>
      <Pressable
        onPress={() => onChange('all')}
        style={[
          styles.brainmathstorieSegmentBtn,
          value === 'all' && styles.brainmathstorieSegmentBtnActive,
        ]}>
        <Text
          style={[
            styles.brainmathstorieSegmentText,
            value === 'all' && styles.brainmathstorieSegmentTextActive,
          ]}>
          All
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('saved')}
        style={[
          styles.brainmathstorieSegmentBtn,
          value === 'saved' && styles.brainmathstorieSegmentBtnActive,
        ]}>
        <Text
          style={[
            styles.brainmathstorieSegmentText,
            value === 'saved' && styles.brainmathstorieSegmentTextActive,
          ]}>
          Saved
        </Text>
      </Pressable>
    </View>
  );
}

const Brainmathstorieeslgnds = () => {
  const brainmathstorieNavigation = useNavigation<any>();
  const [brainmathstorieTab, setBrainmathstorieTab] = useState<'all' | 'saved'>(
    'all',
  );
  const [brainmathstorieSelectedLegendId, setBrainmathstorieSelectedLegendId] =
    useState<string | null>(null);
  const [brainmathstorieSavedIds, setBrainmathstorieSavedIds] = useState<
    Record<string, true>
  >({});

  useFocusEffect(
    useCallback(() => {
      setBrainmathstorieTab('all');
      setBrainmathstorieSelectedLegendId(null);
    }, []),
  );

  useEffect(() => {
    let brainmathstorieCancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(BRAINMATHSTORIEES_SAVED_KEY);
        const ids = raw ? (JSON.parse(raw) as string[]) : [];
        if (!brainmathstorieCancelled) {
          const map: Record<string, true> = {};
          ids.forEach(id => {
            map[id] = true;
          });
          setBrainmathstorieSavedIds(map);
        }
      } catch {
        console.log('error');
      }
    })();
    return () => {
      brainmathstorieCancelled = true;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          BRAINMATHSTORIEES_SAVED_KEY,
          JSON.stringify(Object.keys(brainmathstorieSavedIds)),
        );
      } catch {
        console.log('error');
      }
    })();
  }, [brainmathstorieSavedIds]);

  const brainmathstorieSelectedLegend = useMemo(
    () =>
      brainmathstorieesLegends.find(
        l => l.id === brainmathstorieSelectedLegendId,
      ) ?? null,
    [brainmathstorieSelectedLegendId],
  );

  const brainmathstorieVisibleLegends = useMemo(() => {
    if (brainmathstorieTab === 'saved') {
      return brainmathstorieesLegends.filter(
        l => brainmathstorieSavedIds[l.id],
      );
    }
    return brainmathstorieesLegends;
  }, [brainmathstorieTab, brainmathstorieSavedIds]);

  const brainmathstorieToggleSaved = (id: string) => {
    setBrainmathstorieSavedIds(prev => {
      const next = {...prev};
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  const brainmathstorieShareLegend = async (
    legend: BrainmathstorieesLegend,
  ) => {
    try {
      await Share.share({message: `${legend.title}\n\n${legend.body}`});
    } catch {
      console.log('error');
    }
  };

  if (brainmathstorieSelectedLegend) {
    const brainmathstorieIsSaved =
      !!brainmathstorieSavedIds[brainmathstorieSelectedLegend.id];
    return (
      <Brainmathstorieelay>
        <View style={{paddingTop: 64}}>
          <View style={styles.readerHeader}>
            <Pressable
              onPress={() => setBrainmathstorieSelectedLegendId(null)}
              hitSlop={12}
              style={styles.readerHeaderLeft}>
              <Image
                source={require('../../elements/i/brainmathstoback.png')}
              />
            </Pressable>
            <Text numberOfLines={2} style={styles.readerTitle}>
              {brainmathstorieSelectedLegend.title}
            </Text>
            <View style={styles.readerHeaderRight} />
          </View>

          <FlatList
            data={[brainmathstorieSelectedLegend]}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={() => (
              <View style={styles.readerContentWrap}>
                <LinearGradient
                  colors={['#6A00FF', '#2A1460']}
                  style={styles.readerCard}>
                  <View style={{padding: 15, paddingBottom: 8}}>
                    <Image
                      source={brainmathstorieSelectedLegend.image}
                      style={styles.readerImage}
                    />
                    <Text style={styles.readerBody}>
                      {brainmathstorieSelectedLegend.body}
                    </Text>

                    <View style={styles.readerBottomBar}>
                      <Pressable
                        onPress={() =>
                          brainmathstorieToggleSaved(
                            brainmathstorieSelectedLegend.id,
                          )
                        }
                        hitSlop={10}
                        style={styles.brainmathstorieBottomIconBtn}>
                        <Image
                          source={
                            brainmathstorieIsSaved
                              ? require('../../elements/i/brainmathstosavved.png')
                              : require('../../elements/i/brainmathstosave.png')
                          }
                        />
                      </Pressable>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          brainmathstorieNavigation.navigate(
                            'Brainmathstorieesquz',
                          )
                        }
                        style={styles.testBtnOuter}>
                        <LinearGradient
                          colors={['#8B5CFF', '#FF3EDB']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.testBtn}>
                          <Text style={styles.testBtnText}>Test Yourself</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <Pressable
                        onPress={() =>
                          brainmathstorieShareLegend(
                            brainmathstorieSelectedLegend,
                          )
                        }
                        hitSlop={10}
                        style={styles.brainmathstorieBottomIconBtn}>
                        <Image
                          source={require('../../elements/i/brainmathstosshr.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}
            contentContainerStyle={styles.readerListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Brainmathstorieelay>
    );
  }

  return (
    <Brainmathstorieelay>
      <View style={{paddingTop: 64}}>
        <BrainmathstorieesSegment
          value={brainmathstorieTab}
          onChange={setBrainmathstorieTab}
        />

        <FlatList
          data={brainmathstorieVisibleLegends}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => {
            const brainmathstorieIsSaved = !!brainmathstorieSavedIds[item.id];
            return (
              <LinearGradient
                colors={['#6A00FF', '#2A1460']}
                style={styles.card}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardInner}>
                  <View style={{gap: 15, alignItems: 'center'}}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardActions}>
                      <Pressable
                        onPress={() => brainmathstorieToggleSaved(item.id)}
                        hitSlop={10}>
                        <Image
                          source={
                            brainmathstorieIsSaved
                              ? require('../../elements/i/brainmathstosavved.png')
                              : require('../../elements/i/brainmathstosave.png')
                          }
                        />
                      </Pressable>

                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          setBrainmathstorieSelectedLegendId(item.id)
                        }>
                        <LinearGradient
                          colors={['#8B5CFF', '#FF3EDB']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.readBtn}>
                          <Text style={styles.readBtnText}>Read</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <Pressable
                        onPress={() => brainmathstorieShareLegend(item)}
                        hitSlop={10}>
                        <Image
                          source={require('../../elements/i/brainmathstosshr.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Image
                source={require('../../elements/i/brainmathstnosvd.png')}
                style={{top: 40}}
              />

              <LinearGradient
                colors={['#6A00FF', '#2A1460']}
                style={styles.brainmathstorieGradient}>
                <View style={{padding: 20}}>
                  <Text style={styles.brainmathstorieeheading}>
                    It’s quiet here for now.
                  </Text>
                  <Text style={styles.brainmathstorieedescription}>
                    Save articles to create your own space of knowledge.
                  </Text>
                </View>
              </LinearGradient>
            </View>
          }
        />
      </View>
    </Brainmathstorieelay>
  );
};

export default Brainmathstorieeslgnds;

const styles = StyleSheet.create({
  brainmathstorieSegmentBtnActive: {
    backgroundColor: '#8B5CFFBF',
  },
  brainmathstorieSegmentText: {
    color: 'rgba(255, 255, 255, 0.61)',
    fontSize: 20,
    fontWeight: '700',
  },
  brainmathstorieGradient: {
    borderRadius: 22,
    minHeight: 150,
    width: '89%',
    alignSelf: 'center',
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainmathstorieeheading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  brainmathstorieedescription: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  bg: {flex: 1},

  brainmathstorieSegmentOuter: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1.4,
    borderColor: '#8B5CFF',
    borderRadius: 16,
    padding: 4,
    width: '90%',
  },
  brainmathstorieSegmentBtn: {
    flex: 1,
    height: 35,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brainmathstorieSegmentTextActive: {
    color: '#fff',
  },

  listContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 18,
  },

  card: {
    borderRadius: 20,
    flexDirection: 'row',

    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  cardInner: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 18,
    margin: 10,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    width: '80%',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  readBtn: {
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
  readBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 16,
    fontWeight: '700',
  },

  readerHeader: {
    paddingHorizontal: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readerHeaderLeft: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  readerHeaderRight: {
    width: 40,
  },
  readerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    width: '50%',
  },

  readerListContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  readerContentWrap: {
    alignItems: 'center',
  },
  readerCard: {
    width: '100%',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  readerImage: {
    width: 206,
    height: 206,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 14,
  },
  readerBody: {
    color: 'rgb(255, 255, 255)',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '400',
  },

  readerBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  brainmathstorieBottomIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  testBtnOuter: {
    width: 172,
  },
  testBtn: {
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
  testBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
