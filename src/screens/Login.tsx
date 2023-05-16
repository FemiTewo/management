import * as React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import { useValidation } from '../hooks/useValidation';
import { completeAuth } from '../services/auth';
import { useAppDispatch } from '../redux/hooks';
import { login } from '../redux/auth/slice';

const Login = ({ navigation }) => {
  const [state, setState] = React.useState({
    loading: false,
    error: '',
  });

  const [inputs, errors, blur, update, validate] = useValidation();
  const dispatch = useAppDispatch();

  const authenticate = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({ ...state, loading: true });
      if (validate()) {
        const response = await completeAuth(inputs?.email, inputs?.password);
        console.log(response);
        if (response) {
          //save credentials
          dispatch(login(response));
          setState({ ...state, loading: false });
          return;
        }
      }
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: e.message,
      });
    }
  };

  return (
    <AppBody>
      <View>
        <View style={styles.topic}>
          <AppText text="Email address" />
        </View>
        <TextInput
          autoFocus
          placeholder="Email address"
          keyboardType="email-address"
          style={styles.textInput}
          onBlur={() => blur('email')}
          onChangeText={(text: string) => {
            update(text, 'email');
          }}
        />
        {!!errors?.email && (
          <View>
            <AppText error text={errors?.email} />
          </View>
        )}
        <View style={{ height: 20 }} />
        <View style={styles.topic}>
          <AppText text="Password" />
        </View>
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          style={styles.textInput}
          onBlur={() => blur('password')}
          onChangeText={(text: string) => {
            update(text, 'password');
          }}
        />
        {!!errors?.password && (
          <View>
            <AppText error tiny text={errors?.password} />
          </View>
        )}
        <View style={styles.space} />
        {!!state?.error && (
          <View>
            <AppText error text={state?.error} />
          </View>
        )}
        <View style={styles.space} />
        <AppButton
          text={state.loading ? 'Please wait...' : 'Log In'}
          action={authenticate}
        />
      </View>
    </AppBody>
  );
};

export default Login;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.textInput.backgroundColor,
    borderRadius: 8,
    borderColor: colors.textInput.borderColor,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: 'ClashGrotesk',
  },
  space: { height: 8 },
  topic: {
    marginBottom: 10,
  },
});
