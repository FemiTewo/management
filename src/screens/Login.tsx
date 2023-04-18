import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {checkIfUserExists} from '../services/auth';

const Login = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const [inputs, errors, blur, update, validate] = useValidation();

  const authenticate = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({...state, loading: true});
      if (validate()) {
        const response = await checkIfUserExists(inputs?.fplId);
        if (response) {
          navigation.navigate('password', {
            fplId: inputs?.fplId,
          });
          return;
        }
        navigation.navigate('signup', {
          fplId: inputs?.fplId,
        });
      }
    } finally {
      setState({...state, loading: false});
    }
  };
  return (
    <AppBody>
      <View>
        <View style={styles.topic}>
          <AppText text="Manager ID" />
        </View>
        <TextInput
          autoFocus
          placeholder="FPL ID"
          style={styles.textInput}
          onBlur={() => blur('fplId')}
          onChangeText={(text: string) => {
            update(text, 'fplId');
          }}
        />
        {!!errors?.fplId && (
          <View>
            <AppText error text={errors?.fplId} />
          </View>
        )}
        <View style={styles.space} />
        <AppButton
          text={state.loading ? 'Please wait...' : 'Continue'}
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
    fontFamily: 'GFSNeohellenic-Regular',
  },
  space: {height: 8},
  topic: {
    marginBottom: 10,
  },
});
