import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {saveUserInfo} from '../services/auth';
import {checkUserIsAManager, getUserDetails} from '../api/services';
import {login} from '../redux/auth/slice';
import {useDispatch} from 'react-redux';

const SignUp = ({route}) => {
  const {fplId} = route?.params;
  const [state, setState] = React.useState({
    loading: false,
  });
  const dispatch = useDispatch();

  const [inputs, errors, blur, update, validate] = useValidation();

  const authenticate = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({...state, loading: true});
      console.log();
      if (validate()) {
        if (
          userInfo?.player_first_name.toLowerCase() ===
          (inputs?.player_first_name as string).toLowerCase()
        ) {
          const response = await saveUserInfo(
            fplId,
            inputs?.password,
            userInfo?.name,
          );

          if (response) {
            dispatch(login(userInfo));
          }
        }
      }
    } finally {
      setState({...state, loading: false});
    }
  };

  const [userInfo, setUserInfo] = React.useState();
  const [error, setError] = React.useState<string | null>();
  React.useEffect(() => {
    getUserDetails(fplId)
      .then(data => {
        setUserInfo(data);
      })
      .catch(e => setError('User not found'));
  }, [fplId]);
  return (
    <AppBody title={fplId}>
      <View>
        <View style={styles.topic}>
          <AppText
            text={
              userInfo
                ? `Confirm & sign up to confirm ${userInfo.name} belongs to you.`
                : `${fplId} does not belong to any manager`
            }
          />
        </View>
        {userInfo && (
          <>
            <View style={styles.topic}>
              <AppText text="Choose password" />
            </View>
            <TextInput
              autoFocus
              secureTextEntry
              placeholder="Create a password"
              style={styles.textInput}
              onBlur={() => blur('password')}
              onChangeText={(text: string) => {
                update(text, 'password');
              }}
            />
            {!!errors?.password && (
              <View>
                <AppText error text={errors?.password} />
              </View>
            )}
            <View style={styles.space} />
            <View style={styles.topic}>
              <AppText text="First name" />
            </View>
            <TextInput
              keyboardType="name-phone-pad"
              placeholder="Enter your first name as is on FPL"
              style={styles.textInput}
              onBlur={() => blur('player_first_name')}
              onChangeText={(text: string) => {
                update(text, 'player_first_name');
              }}
            />
            {!!errors?.player_first_name && (
              <View>
                <AppText error text={errors?.player_first_name} />
              </View>
            )}
            <View style={styles.space} />
            <AppButton
              text={state.loading ? 'Please wait...' : 'Confirm & Sign Up'}
              action={authenticate}
            />
          </>
        )}
      </View>
    </AppBody>
  );
};

export default SignUp;

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
});
