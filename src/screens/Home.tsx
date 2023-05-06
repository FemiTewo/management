import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const {user_name, last_name} = useAppSelector(selectUserData);

  const {colors} = useTheme();

  return (
    <AppBody title={`Welcome, ${user_name}`} fullView>
      <AppText text="Project Manager" tiny />
      {state?.loading && <ActivityIndicator />}

      <View style={styles.space} />
      <AppText topic text="Teams" />
      <View style={styles.space} />
      <View style={{alignItems: 'flex-start'}}>
        <AppButton
          alternate
          text="Create a Team"
          action={() => {}}
          icon={
            <View style={{marginRight: 10}}>
              <Feather name="plus" size={28} color={colors.icon} />
            </View>
          }
        />
      </View>
      <View style={styles.space} />
      <View>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('team')}>
          <View style={styles.drop}>
            <View style={styles.icon}>
              <SimpleLineIcons name="docs" size={28} color={colors.icon} />
            </View>
            <View>
              <AppText text="Project 1" />
              <AppText tiny text="2 members" />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View style={styles.drop}>
            <View style={styles.icon}>
              <SimpleLineIcons name="docs" size={28} color={colors.icon} />
            </View>
            <View>
              <AppText text="Project 2" />
              <AppText tiny text="3 members" />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View style={styles.drop}>
            <View style={styles.icon}>
              <SimpleLineIcons name="docs" size={28} color={colors.icon} />
            </View>
            <View>
              <AppText text="Project 3" />
              <AppText tiny text="5 members" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </AppBody>
  );
};

export default Home;

const styles = StyleSheet.create({
  drop: {
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
  },
  textInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: 'GFSNeohellenic-Regular',
  },
  space: {height: 8},
  topic: {
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHead: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
