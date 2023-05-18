import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import {useValidation} from '../hooks/useValidation';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import ActionSheet from 'react-native-actions-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {selectProjects} from '../redux/projects/slice';
import {saveBoard} from '../services/project';

const CreateBoard = ({navigation}: {navigation: any}) => {
  const [state, setState] = React.useState({
    loading: false,
    error: '',
  });

  const projects = useAppSelector(selectProjects);

  const actionSheetRef = React.useRef(null);
  const actionProjectSheetRef = React.useRef(null);

  const [inputs, errors, blur, update, validate] = useValidation();
  const dispatch = useAppDispatch();

  const create = async () => {
    try {
      if (state.loading) {
        return;
      }
      setState({...state, loading: true});
      if (validate()) {
        const response = await saveBoard(inputs, inputs?.project);
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
    update('Ongoing', 'status');
    update('', 'title');
    update('', 'description');
  }, []);

  return (
    <>
      <AppBody title="Add Board">
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

          <View style={styles.topic}>
            <AppText text="Project" />
          </View>
          <TextInput
            placeholder="Choose Project"
            style={styles.textInput}
            onBlur={() => blur('project')}
            onFocus={() => {
              Keyboard.dismiss();
              actionProjectSheetRef.current?.show();
            }}
            value={projects.find(p => p.id === inputs?.project)?.title || ''}
          />
          {!!errors?.project && (
            <View>
              <AppText error tiny text={errors?.project} />
            </View>
          )}
          <View style={styles.space} />
          <View style={styles.topic}>
            <AppText text="Status" />
          </View>
          <TextInput
            placeholder="Choose Status"
            style={styles.textInput}
            onBlur={() => blur('status')}
            onFocus={() => {
              Keyboard.dismiss();
              actionSheetRef.current?.show();
            }}
            onChangeText={(text: string) => {
              update(text, 'description');
            }}
            value={inputs?.status}
          />
          {!!errors?.status && (
            <View>
              <AppText error tiny text={errors?.status} />
            </View>
          )}

          <View style={styles.space} />
          {!!state?.error && (
            <View>
              <AppText tiny error text={state?.error} />
            </View>
          )}
          <View style={styles.space} />

          <AppButton
            text={state.loading ? 'Please wait...' : 'Create Board'}
            action={create}
          />
        </View>
      </AppBody>
      <ActionSheet ref={actionSheetRef}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Set Task Status" />
          </View>
          <View>
            {['Ongoing', 'Complete'].map(status => (
              <TouchableWithoutFeedback
                onPress={async () => {
                  update(status, 'status');
                  actionSheetRef.current?.hide();
                  // const thisTask = [...tasks].find(
                  //     task => task?.id === currentTask?.id,
                  // );
                  // if (!thisTask) return;
                  // thisTask.status = status;

                  // setTasks([
                  //     ...[...tasks].filter(task => task.id !== currentTask.id),
                  //     thisTask,
                  // ]);

                  // setCurrentTask({ ...currentTask, status });
                }}>
                <View style={{padding: 10, flexDirection: 'row'}}>
                  <>
                    {status === inputs?.status ? (
                      <SimpleLineIcons name="check" size={24} />
                    ) : (
                      <Ionicons name="md-radio-button-off-outline" size={24} />
                    )}
                    <View width={10} />
                  </>
                  <View style={{justifyContent: 'center'}}>
                    <AppText text={status} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </ActionSheet>
      <ActionSheet ref={actionProjectSheetRef}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Choose Project" />
          </View>
          <View>
            {[...projects].map(({title, id}) => (
              <TouchableWithoutFeedback
                onPress={async () => {
                  update(id, 'project');
                  actionProjectSheetRef.current?.hide();
                }}>
                <View style={{padding: 10, flexDirection: 'row'}}>
                  <>
                    {inputs?.project === id ? (
                      <SimpleLineIcons name="check" size={24} />
                    ) : (
                      <Ionicons name="md-radio-button-off-outline" size={24} />
                    )}
                    <View style={{width: 10}} />
                  </>
                  <View style={{justifyContent: 'center'}}>
                    <AppText text={title} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </ActionSheet>
    </>
  );
};

export default CreateBoard;

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
