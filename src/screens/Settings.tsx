import * as React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../components/AppText';
import AppBody from '../components/AppBody';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {logout, selectUserData} from '../redux/auth/slice';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {selectTheme, switchTheme} from '../redux/settings/slice';
import {useTheme} from '@react-navigation/native';

const Settings = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const {user_name, last_name} = useAppSelector(selectUserData);

  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const {colors} = useTheme();

  return (
    <AppBody title="Settings" fullView>
      {state?.loading && <ActivityIndicator />}

      <View style={styles.space} />

      <View style={styles.space} />
      <View>
        <TouchableWithoutFeedback onPress={() => dispatch(switchTheme())}>
          <View style={styles.drop}>
            <View style={styles.icon}>
              <Feather
                name={theme === 'light' ? 'moon' : 'sun'}
                size={28}
                color={colors.icon}
              />
            </View>
            <View>
              <AppText text="Dark Mode" />
              <AppText
                tiny
                text={
                  theme === 'light'
                    ? 'Change to light mode'
                    : 'Change to light mode'
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => dispatch(logout())}>
          <View style={styles.drop}>
            <View style={[styles.icon, {marginRight: 20, marginLeft: -10}]}>
              <SimpleLineIcons name="logout" size={28} color={colors.icon} />
            </View>
            <View>
              <AppText text="Sign Out" />
              <AppText tiny text="Quit Management App." />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </AppBody>
  );
};

export default Settings;

const styles = StyleSheet.create({
  drop: {
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
  },
  space: {height: 8},
  topic: {
    marginBottom: 10,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
