import * as React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';

const Home = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const {user_name, last_name} = useAppSelector(selectUserData);

  console.log('====================================');
  console.log(user_name, last_name);
  console.log('====================================');

  return (
    <AppBody title={`Welcome, ${user_name}`}>
      {state?.loading && <ActivityIndicator />}

      <View>
        <Text>
          <AppText text="Current Gameweek: " />
        </Text>
      </View>
      <View>
        <Text>
          <AppText text="Points Gathered: " />
        </Text>
      </View>
      <View style={styles.space} />
      <AppText topic text="Wallet Information" />
      <View>
        <Text>
          <AppText text="Available balance: " />
          <AppText text="N 23,000" />
        </Text>
      </View>
      <View style={styles.space} />
      <View style={{alignItems: 'flex-start'}}>
        <AppButton alternate text={'Top up'} action={() => {}} />
      </View>
      <View style={styles.space} />
      <AppText topic text="Contests" />
      <View style={styles.tableHead}>
        {/* <Text>
              <AppText text="Available balance: " />
              <AppText text="N 23,000" />
            </Text> */}
        <View style={{flex: 0.5}}>
          <AppText color={colors.appWhite} text="S/N" />
        </View>
        <View style={{flex: 2}}>
          <AppText color={colors.appWhite} text="Name" />
        </View>
        <View style={{flex: 0.5}}>
          <AppText color={colors.appWhite} text="Pos" />
        </View>
      </View>
      <View style={styles.tableRow}>
        {/* <Text>
              <AppText text="Available balance: " />
              <AppText text="N 23,000" />
            </Text> */}
        <View style={{flex: 0.5, padding: 8}}>
          <AppText text="1" />
        </View>
        <View style={{flex: 2, padding: 8}}>
          <AppText text="Trial" />
        </View>
        <View style={{flex: 0.5, padding: 8}}>
          <AppText text="30" />
        </View>
      </View>
      <View style={styles.tableRow}>
        {/* <Text>
              <AppText text="Available balance: " />
              <AppText text="N 23,000" />
            </Text> */}
        <View style={{flex: 0.5, padding: 8}}>
          <AppText text="2" />
        </View>
        <View style={{flex: 2, padding: 8}}>
          <AppText text="VIP" />
        </View>
        <View style={{flex: 0.5, padding: 8}}>
          <AppText text="3" />
        </View>
      </View>
    </AppBody>
  );
};

export default Home;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.textInput.backgroundColor,
    borderRadius: 8,
    borderColor: colors.textInput.borderColor,
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
    backgroundColor: colors.button.backgroundColor,
    padding: 8,
    borderRadius: 8,
  },
});
