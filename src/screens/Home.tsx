import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';
import {getUserDetails} from '../api/services';

const Home = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const {name, id} = useAppSelector(selectUserData);
  const [userInfo, setUserInfo] = React.useState();
  console.log(userInfo);

  React.useEffect(() => {
    setState({...state, loading: true});
    getUserDetails(id)
      .then(data => {
        setUserInfo(data);
      })
      .finally(() => {
        setState({...state, loading: false});
      });
  }, [id]);
  return (
    <AppBody title={`Welcome, ${name}`}>
      {state?.loading && <ActivityIndicator />}
      {userInfo && (
        <>
          <View>
            <Text>
              <AppText text="Current Gameweek: " />
              <AppText text={userInfo?.current_event} />
            </Text>
          </View>
          <View>
            <Text>
              <AppText text="Points Gathered: " />
              <AppText text={userInfo?.summary_event_points} />
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
        </>
      )}
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
