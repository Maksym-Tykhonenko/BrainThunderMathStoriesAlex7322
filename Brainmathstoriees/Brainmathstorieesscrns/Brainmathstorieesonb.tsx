import Brainmathstorieelay from '../Brainmathstorieescpnn/Brainmathstorieelay';
import LinearGradient from 'react-native-linear-gradient';

import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';

const brainmathstorieeData = [
  {
    id: 1,
    heading: 'Logic becomes energy',
    description:
      'Turn simple rules into fast decisions. Train your focus and react in the moment.',
    image: require('../../elements/i/brainmathston1.png'),
  },
  {
    id: 2,
    heading: 'Start. Think. Repeat.',
    description:
      'A dynamic challenge where conditions change and your speed keeps growing.',
    image: require('../../elements/i/brainmathston2.png'),
  },
  {
    id: 3,
    heading: 'Understand, not guess',
    description:
      'Short quizzes help you see patterns and build real understanding step by step.',
    image: require('../../elements/i/brainmathston3.png'),
  },
  {
    id: 4,
    heading: 'Stories that explain everything',
    description:
      'Learn math through simple legends that make complex ideas feel natural.',
    image: require('../../elements/i/brainmathston4.png'),
  },
  {
    id: 5,
    heading: 'A small step every day',
    description:
      'Daily challenges keep you consistent and show your progress over time.',
    image: require('../../elements/i/brainmathston5.png'),
  },
];

const Brainmathstorieesonb = () => {
  const navigation = useNavigation<any>();
  const [brainmathstorieIdx, setBrainmathstorieIdx] = useState(0);

  const brainmathstorieeOnNext = () => {
    brainmathstorieIdx < 4
      ? setBrainmathstorieIdx(brainmathstorieIdx + 1)
      : navigation.navigate('Brainmathstorieestabs');
  };

  return (
    <Brainmathstorieelay>
      <View style={styles.brainmathstorieecontainer}>
        <Image
          source={brainmathstorieeData[brainmathstorieIdx].image}
          style={{alignSelf: 'center', top: 65}}
        />

        <LinearGradient
          colors={['#6A00FF', '#2A1460']}
          style={styles.brainmathstorieGradient}>
          <View style={{padding: 20}}>
            <Text style={styles.brainmathstorieeheading}>
              {brainmathstorieeData[brainmathstorieIdx].heading}
            </Text>
            <Text style={styles.brainmathstorieedescription}>
              {brainmathstorieeData[brainmathstorieIdx].description}
            </Text>
          </View>
        </LinearGradient>

        <TouchableOpacity onPress={brainmathstorieeOnNext} activeOpacity={0.7}>
          <LinearGradient
            colors={['#8B5CFF', '#FF3EDB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.brainmathstorieebutton}>
            <Text style={styles.brainmathstorieebuttontext}>
              {brainmathstorieIdx < 4 ? 'Next' : 'Begin'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Brainmathstorieelay>
  );
};

const styles = StyleSheet.create({
  brainmathstorieecontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  brainmathstorieGradient: {
    borderRadius: 22,
    minHeight: 202,
    width: '89%',
    alignSelf: 'center',
    shadowColor: 'rgba(255, 62, 220, 0.68)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
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
  brainmathstorieebutton: {
    borderRadius: 16,
    width: 172,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  brainmathstorieebuttontext: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});

export default Brainmathstorieesonb;
