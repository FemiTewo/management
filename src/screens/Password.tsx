import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {useAppDispatch} from '../redux/hooks';
import {completeAuth, getUserData} from '../services/auth';
import {login} from '../redux/auth/slice';

const Password = ({route}) => {
  const {fplId} = route.params;
  const [state, setState] = React.useState({
    loading: false,
  });

  const [error, setError] = React.useState<string | null>();

  const [inputs, errors, blur, update, validate] = useValidation();
  const dispatch = useAppDispatch();

  const authenticate = async () => {
    try {
      if (state.loading) {
        return;
      }
      // unset errors
      setError(null);
      setState({...state, loading: true});
      if (validate()) {
        const response = await completeAuth(fplId, inputs?.password);
        if (response) {
          let data = await getUserData(fplId);
          dispatch(login(data));
          return;
        }
        setError('Incorrect password, try again!');
      }
    } finally {
      setState({...state, loading: false});
    }
  };
  return (
    <AppBody title={fplId}>
      <View>
        <View style={styles.topic}>
          <AppText text="Password" />
        </View>
        <TextInput
          autoFocus
          secureTextEntry
          placeholder="Enter Password"
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
        {!!error && (
          <View>
            <AppText error text={error} />
          </View>
        )}
        <View style={styles.space} />
        <AppButton
          text={state.loading ? 'Please wait...' : 'Login'}
          action={authenticate}
        />
      </View>
    </AppBody>
  );
};

export default Password;

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
