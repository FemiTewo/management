import * as React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {
  changeTaskStatus,
  getDatesBetween,
  getDeepColors,
  getTasksFromBoard,
  max_date,
  min_date,
  months,
} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectBoard, setTask} from '../redux/projects/slice';
import Octicons from 'react-native-vector-icons/Octicons';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-gesture-handler';

const SPACEBETWEENDATES = 30;
const HEIGHTBETWEENDATES = (x: 5) => {
  if (x < 3) {
    return 200;
  }
  if (x < 5) {
    return 400;
  }
  if (x < 10) {
    return 400;
  }
  if (x < 15) {
    return 600;
  }

  return 800;
};

const deepColors = getDeepColors();

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
            <Octicons name="tasklist" size={28} color="#666" />
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

const Tasks = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = React.useState<
    {
      id: string;
      status: string;
      title: string;
      description: string;
      end: string;
      start: string;
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

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('kanban');
  const [items, setItems] = React.useState([
    {label: 'Kanban Board', value: 'kanban'},
    {label: 'Gantt Chart', value: 'gantt'},
  ]);

  // console.log(getDatesBetween(min_date(tasks), max_date(tasks)));
  const datesBetween = getDatesBetween(min_date(tasks), max_date(tasks));

  const [minimized, setMinimized] = React.useState(true);
  return (
    <>
      <AppBody title={board.title || 'Tasks'} fullView>
        <View style={styles.space} />
        <View style={{alignItems: 'flex-start'}}>
          <AppButton
            alternate
            text="Create Task"
            action={() => {
              navigation.navigate('CreateTask');
            }}
            icon={
              <View style={{marginRight: 10}}>
                <Feather name="plus" size={28} color="#666" />
              </View>
            }
          />
        </View>
        <View style={styles.space} />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <View style={styles.space} />
        {value === 'gantt' && tasks.length > 0 && (
          <>
            <View style={{flexDirection: 'row'}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setMinimized(!minimized);
                }}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: minimized ? 'grey' : 'transparent',
                    borderColor: 'grey',
                    borderWidth: 1,
                  }}>
                  <AppText
                    tiny
                    text={minimized ? 'Maximize' : 'Minimize'}
                    color={minimized ? 'white' : 'black'}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.space} />

            <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10}}>
                {tasks.map(({title, start, end}, tIndex) => {
                  // console.log(end.toISOString().substr(0, 10));
                  return (
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        width: minimized ? 20 : 80,
                        overflow: 'hidden',
                      }}>
                      <View
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          alignSelf: 'flex-start',
                          backgroundColor: deepColors[tIndex % 20],
                          paddingHorizontal: 10,
                          paddingVertical: 2,
                          borderRadius: 4,
                          height: 28,
                          overflow: 'hidden',
                        }}>
                        <AppText text={title} color="white" />
                      </View>
                      <View
                        style={{
                          height:
                            HEIGHTBETWEENDATES(tasks.length) / tasks.length -
                            36.5,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      width: SPACEBETWEENDATES * datesBetween.length,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      backgroundColor: 'skyblue',
                      height: HEIGHTBETWEENDATES(tasks.length),
                    }}>
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}>
                      {tasks.map((task, tIndex) => {
                        return (
                          <>
                            <View
                              // eslint-disable-next-line react-native/no-inline-styles
                              style={{
                                position: 'relative',
                                height: 30,
                                width: datesBetween.length * SPACEBETWEENDATES,
                              }}>
                              {datesBetween.map((date, index) => {
                                if (
                                  new Date(date) >= new Date(task.start) &&
                                  new Date(date) <= new Date(task.end)
                                ) {
                                  return (
                                    <>
                                      <View
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        style={{
                                          position: 'absolute',
                                          left: index * SPACEBETWEENDATES,
                                          height: 20,
                                          width: SPACEBETWEENDATES,
                                          backgroundColor:
                                            deepColors[tIndex % 20],
                                        }}
                                      />
                                    </>
                                  );
                                }
                              })}
                            </View>
                            <View
                              style={{
                                height:
                                  HEIGHTBETWEENDATES(tasks.length) /
                                    tasks.length -
                                  38,
                              }}
                            />
                          </>
                        );
                      })}
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {datesBetween &&
                      datesBetween.map((date, index) => {
                        let d = date.split('-')[2];
                        let k = date.split('-')[1];
                        let y = date.split('-')[0];
                        let newK =
                          index !== 0
                            ? datesBetween[index - 1].split('-')[1]
                            : '';
                        let newY =
                          index !== 0
                            ? datesBetween[index - 1].split('-')[0]
                            : '';
                        return (
                          <View>
                            <View
                              // eslint-disable-next-line react-native/no-inline-styles
                              style={{
                                width: SPACEBETWEENDATES,
                                overflow: 'hidden',
                                alignItems: 'center',
                              }}>
                              <AppText text={parseInt(d)} />
                            </View>
                            {(index === 0 || k !== newK) && (
                              <View>
                                <AppText text={months[parseInt(k) - 1]} />
                              </View>
                            )}
                            {(index === 0 || y !== newY) && (
                              <View>
                                <AppText
                                  strong
                                  text={`'${y.substring(2, 4)}`}
                                />
                              </View>
                            )}
                          </View>
                        );
                      })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </>
        )}

        {tasks.length === 0 && (
          <>
            <View
              style={{
                padding: 10,
                backgroundColor: '#ececec',
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#cbcbcb',
              }}>
              <AppText tiny text="Add a task to see them below." />
            </View>
          </>
        )}

        {value === 'kanban' && tasks.length > 0 && (
          <>
            <View style={styles.space} />
            <View
              style={{backgroundColor: 'green', padding: 5, borderRadius: 8}}>
              <AppText
                tiny
                strong
                color="white"
                text="Press and hold task to edit"
              />
            </View>
            <View style={styles.space} />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F0F0F0',
                paddingVertical: 8,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#cfcfcf',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setActive('To-do');
                }}>
                <View
                  style={[
                    styles.menu,
                    active === 'To-do' ? styles.active : {},
                  ]}>
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
                <View
                  style={[styles.menu, active === 'Done' ? styles.active : {}]}>
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
                    task =>
                      task?.status === active && task?.status !== 'Deleted',
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
          </>
        )}
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
