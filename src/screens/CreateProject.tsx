import * as React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {useAppSelector} from '../redux/hooks';
import {saveProject} from '../services/project';
import {selectUserData} from '../redux/auth/slice';

const CreateProject = ({navigation}: {navigation: any}) => {
  const [state, setState] = React.useState({
    loading: false,
    error: '',
  });

  const [inputs, errors, blur, update, validate] = useValidation();

  const user = useAppSelector(selectUserData);

  const create = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({...state, loading: true});
      if (validate()) {
        const response = await saveProject(inputs, user?.id);
        console.log(response);
        if (response) {
          //save credentials
          navigation.goBack();
          setState({...state, loading: false});
          return;
        }
      }
      setState({...state, loading: false});
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: e.message,
      });
    }
  };

  React.useEffect(() => {
    update('', 'title');
    update('', 'description');
  }, []);

  return (
    <>
      <AppBody title="Create Project">
        <View>
          <View style={styles.topic}>
            <AppText text="Title" />
          </View>
          <TextInput
            autoFocus
            placeholder="Name the board"
            keyboardType="name-phone-pad"
            style={styles.textInput}
            onBlur={() => blur('title')}
            onChangeText={(text: string) => {
              update(text, 'title');
            }}
          />
          {!!errors?.title && (
            <View>
              <AppText error text={errors?.title} />
            </View>
          )}
          <View style={styles.space} />
          <View style={styles.topic}>
            <AppText text="Description" />
          </View>
          <TextInput
            placeholder="Description"
            style={styles.textInput}
            onBlur={() => blur('description')}
            onChangeText={(text: string) => {
              update(text, 'description');
            }}
          />
          {!!errors?.description && (
            <View>
              <AppText error tiny text={errors?.description} />
            </View>
          )}
          <View style={styles.space} />

          <View style={styles.space} />
          {!!state?.error && (
            <View>
              <AppText tiny error text={state?.error} />
            </View>
          )}
          <View style={styles.space} />

          <AppButton
            text={state.loading ? 'Please wait...' : 'Create New Project'}
            action={create}
          />
        </View>
      </AppBody>
    </>
  );
};

export default CreateProject;

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
