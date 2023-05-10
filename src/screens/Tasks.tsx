import * as React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {changeTaskStatus, getTasksFromBoard} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectBoard, setTask} from '../redux/projects/slice';
import Octicons from 'react-native-vector-icons/Octicons';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const EachTask = ({
  title,
  description,
  colors,
  onPress,
  onLongPress,
}: {
  title: string;
  description: string;
  colors: any;
  onLongPress: () => void;
  onPress: () => void;
}) => (
  <View style={styles.slide}>
    <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.slide}>
        <View style={styles.drop}>
          <View style={styles.icon}>
            <Octicons name="tasklist" size={28} color={colors.icon} />
          </View>
          <View>
            <AppText text={title} />
            <AppText tiny text={description} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
);

const Tasks = ({navigation}) => {
  const {colors} = useTheme();
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = React.useState<
    {
      id: string;
      status: string;
      assinged_to: string;
      title: string;
      description: string;
    }[]
  >([]);
  const [currentTask, setCurrentTask] = React.useState<{
    id: string;
    status: string;
  }>({id: '', status: 'Deleted'});

  React.useEffect(() => {
    (async () => {
      let response = await getTasksFromBoard(board.id);
      if (response) {
        setTasks(response);
      }
    })();
  }, []);

  const [active, setActive] = React.useState<
    'To-do' | 'In Progress' | 'Quality Assurance' | 'Done' | 'Deleted'
  >('To-do');

  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const deleteActionSheetRef = React.useRef<ActionSheetRef>(null);

  return (
    <>
      <AppBody title={board.title || 'Tasks'} fullView>
        <View style={styles.space} />
        <View style={{alignItems: 'flex-start'}}>
          <AppButton
            alternate
            text="Create Board"
            action={() => {}}
            icon={
              <View style={{marginRight: 10}}>
                <Feather name="plus" size={28} color={colors.icon} />
              </View>
            }
          />
        </View>
        <View style={styles.space} />
        <View style={{flexDirection: 'row'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              setActive('To-do');
            }}>
            <View
              style={[styles.menu, active === 'To-do' ? styles.active : {}]}>
              <AppText
                color={active === 'To-do' ? 'white' : 'black'}
                strong={active === 'To-do'}
                text="To Do"
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setActive('In Progress');
            }}>
            <View
              style={[
                styles.menu,
                active === 'In Progress' ? styles.active : {},
              ]}>
              <AppText
                color={active === 'In Progress' ? 'white' : 'black'}
                strong={active === 'In Progress'}
                text="In Progress"
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setActive('Quality Assurance');
            }}>
            <View
              style={[
                styles.menu,
                active === 'Quality Assurance' ? styles.active : {},
              ]}>
              <AppText
                color={active === 'Quality Assurance' ? 'white' : 'black'}
                strong={active === 'Quality Assurance'}
                text="QA"
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setActive('Done');
            }}>
            <View style={[styles.menu, active === 'Done' ? styles.active : {}]}>
              <AppText
                color={active === 'Done' ? 'white' : 'black'}
                strong={active === 'Done'}
                text="Done"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{height: 10}} />
        <View style={styles.slide}>
          <View>
            {tasks
              .filter(
                task => task?.status === active && task?.status !== 'Deleted',
              )
              .map(task => {
                const {id, title, description, status} = task;
                return (
                  <EachTask
                    key={id}
                    title={title}
                    description={description}
                    onPress={() => {
                      dispatch(setTask({id, title}));
                      navigation.navigate('Task');
                    }}
                    onLongPress={() => {
                      setCurrentTask({id, status});
                      actionSheetRef.current?.show();
                    }}
                    colors={colors}
                  />
                );
              })}
          </View>
        </View>
      </AppBody>
      <ActionSheet ref={actionSheetRef}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Set Task Status" />
          </View>
          <View>
            {['To-do', 'In Progress', 'Quality Assurance', 'Done'].map(
              status => (
                <TouchableWithoutFeedback
                  onPress={async () => {
                    await changeTaskStatus(currentTask.id, status);
                    const thisTask = [...tasks].find(
                      task => task?.id === currentTask?.id,
                    );
                    if (!thisTask) return;
                    thisTask.status = status;

                    setTasks([
                      ...[...tasks].filter(task => task.id !== currentTask.id),
                      thisTask,
                    ]);

                    setCurrentTask({...currentTask, status});
                  }}>
                  <View style={{padding: 10, flexDirection: 'row'}}>
                    <>
                      {status === currentTask.status ? (
                        <SimpleLineIcons name="check" size={24} />
                      ) : (
                        <Ionicons
                          name="md-radio-button-off-outline"
                          size={24}
                        />
                      )}
                      <View width={10} />
                    </>
                    <View style={{justifyContent: 'center'}}>
                      <AppText text={status} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ),
            )}
          </View>
          <View style={{padding: 10}}>
            <AppText strong text="Actions" />
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                actionSheetRef.current?.hide();
                deleteActionSheetRef.current?.show();
              }}>
              <View style={{padding: 10, flexDirection: 'row'}}>
                <SimpleLineIcons name="trash" size={24} />
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <AppText text="Delete" />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ActionSheet>
      <ActionSheet ref={deleteActionSheetRef}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Are you sure you want to delete?" />
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={async () => {
                console.log(currentTask.id);
                const res = await changeTaskStatus(currentTask.id, 'Deleted');
                if (!res) return;
                const thisTask = [...tasks].find(
                  task => task?.id === currentTask?.id,
                );
                if (!thisTask) return;
                thisTask.status = 'Deleted';

                setTasks([
                  ...[...tasks].filter(task => task.id !== currentTask.id),
                  thisTask,
                ]);

                setCurrentTask({});
                deleteActionSheetRef.current?.hide();
                actionSheetRef.current?.hide();
              }}>
              <View style={{padding: 10, flexDirection: 'row'}}>
                <Ionicons name="md-radio-button-off-outline" size={24} />
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <AppText text="Yes" />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                deleteActionSheetRef.current?.hide();
                actionSheetRef.current?.show();
              }}>
              <View style={{padding: 10, flexDirection: 'row'}}>
                <Ionicons name="md-radio-button-off-outline" size={24} />
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <AppText text="No" />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ActionSheet>
    </>
  );
};

export default Tasks;

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
  tableRow: {
    flexDirection: 'row',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  slide: {
    flex: 1,
  },
  menu: {
    padding: 4,
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  active: {
    backgroundColor: 'grey',
    borderRadius: 8,
  },
});
