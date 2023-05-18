import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {completeAuth, saveUserInfo} from '../services/auth';
import {useAppDispatch} from '../redux/hooks';
import {login} from '../redux/auth/slice';
import {useFocusEffect} from '@react-navigation/native';

const CreateAccount = ({navigation}: {navigation: any}) => {
  const [state, setState] = React.useState({
    loading: false,
    error: '',
  });

  const [inputs, errors, blur, update, validate, register] = useValidation();

  useFocusEffect(
    React.useCallback(() => {
      register(['email', 'first_name', 'last_name', 'user_name', 'password']);
    }, []),
  );

  const dispatch = useAppDispatch();

  const create = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({...state, loading: true});
      console.log(inputs, errors);
      if (validate()) {
        const response = await saveUserInfo(inputs);
        if (response) {
          //save credentials
          dispatch(login(response));
          setState({...state, loading: false});
          return;
        }
      }
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: e.message,
      });
    } finally {
      setState({
        ...state,
        loading: false,
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
        <View style={{height: 20}} />

        <View style={styles.topic}>
          <AppText text="First Name" />
        </View>
        <TextInput
          placeholder="First Name"
          keyboardType="name-phone-pad"
          style={styles.textInput}
          onBlur={() => blur('first_name')}
          onChangeText={(text: string) => {
            update(text, 'first_name');
          }}
        />
        {!!errors?.first_name && (
          <View>
            <AppText error text={errors?.first_name} />
          </View>
        )}
        <View style={{height: 20}} />

        <View style={styles.topic}>
          <AppText text="Last Name" />
        </View>
        <TextInput
          placeholder="Last Name"
          keyboardType="name-phone-pad"
          style={styles.textInput}
          onBlur={() => blur('last_name')}
          onChangeText={(text: string) => {
            update(text, 'last_name');
          }}
        />
        {!!errors?.last_name && (
          <View>
            <AppText error text={errors?.last_name} />
          </View>
        )}
        <View style={{height: 20}} />

        <View style={styles.topic}>
          <AppText text="User Name" />
        </View>
        <TextInput
          placeholder="User Name"
          keyboardType="name-phone-pad"
          style={styles.textInput}
          onBlur={() => blur('user_name')}
          onChangeText={(text: string) => {
            update(text, 'user_name');
          }}
        />
        {!!errors?.user_name && (
          <View>
            <AppText error text={errors?.user_name} />
          </View>
        )}
        <View style={{height: 20}} />

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
          text={state.loading ? 'Please wait...' : 'Create Account'}
          action={create}
        />
        <View style={styles.space} />
      </View>
    </AppBody>
  );
};

export default CreateAccount;

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
  space: {height: 8},
  topic: {
    marginBottom: 10,
  },
});
