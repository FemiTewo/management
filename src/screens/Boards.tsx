import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import {
  changeBoardDetails,
  changeBoardStatus,
  changeProjectDetails,
  getAllUsers,
  getBoards,
  getProjects,
  saveTeamMembers,
} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';
import {
  loadProjects,
  selectMembers,
  selectProjects,
  setBoard,
  setProjectMembers,
} from '../redux/projects/slice';
import ActionSheet from 'react-native-actions-sheet';
import {TextInput} from 'react-native';
import colors from '../settings/colors';

const Boards = ({navigation}: {navigation: any}) => {
  const [active, setActive] = React.useState<number | null>();
  const [boards, setBoards] = React.useState([]);
  const [state, setState] = React.useState({
    projectLoading: false,
    boardLoading: false,
  });

  const user = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);

  const actionSheetRef = React.useRef(null);
  const actionMemberSheetRef = React.useRef(null);
  const deleteActionSheetRef = React.useRef(null);
  const actionBoardSheetRef = React.useRef(null);

  const projectMembers = useAppSelector(selectMembers);

  const [allUsers, setAllUsers] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setState({...state, projectLoading: true});
        let response = await getProjects(user.id);
        if (response) {
          dispatch(loadProjects(response));
        }
        let userResponse = await getAllUsers();
        if (userResponse) {
          setAllUsers(userResponse);
        }
        if (response) setState({...state, projectLoading: false});
      })();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!active && active !== 0) return;
      (async () => {
        setState({...state, boardLoading: true});
        let response = await getBoards(projects[active].id);
        if (response) {
          setBoards(response.boards);
          dispatch(setProjectMembers(response.members));
        }
        setState({...state, boardLoading: false});
      })();
    }, [active]),
  );

  const [currentProject, setCurrentProjects] = React.useState({
    id: '',
    title: '',
    description: '',
  });

  const [currentBoard, setCurrentBoard] = React.useState({
    id: '',
    title: '',
    description: '',
    status: '',
  });

  console.log(boards, currentBoard);

  return (
    <AppBody title="Boards" fullView>
      {state?.loading && <ActivityIndicator />}
      <View style={styles.space} />
      <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
        <AppButton
          alternate
          text="Create Project"
          action={() => {
            navigation.navigate('CreateProject');
          }}
          icon={
            <View style={{marginRight: 10}}>
              <AntDesign name="addfolder" size={28} color="#666" />
            </View>
          }
        />
        <View style={{width: 10}} />
        {projects.length > 0 && (
          <AppButton
            alternate
            text="Create Board"
            action={() => {
              navigation.navigate('CreateBoard');
            }}
            icon={
              <View style={{marginRight: 10}}>
                <Entypo name="add-to-list" size={28} color="#666" />
              </View>
            }
          />
        )}
      </View>
      <View style={styles.space} />
      {state.projectLoading && (
        <View style={styles.drop}>
          <ActivityIndicator />
        </View>
      )}
      {projects.length === 0 && (
        <View style={styles.drop}>
          <AppText text="Add a project to see them here." />
        </View>
      )}
      {projects.map((project, index) => (
        <>
          <TouchableWithoutFeedback
            onPress={() =>
              active === index ? setActive(null) : setActive(index)
            }
            onLongPress={() => {
              if (active !== index) {
                setActive(index);
              }
              setCurrentProjects({
                id: project.id,
                title: project.title,
                description: project.description,
              });
              actionSheetRef.current?.show();
            }}>
            <View style={styles.drop}>
              <View style={styles.icon}>
                <AntDesign name="folder1" size={28} color="#666" />
              </View>
              <View>
                <AppText text={project.title} />
                <AppText tiny text={project.description} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {active === index && (
            <>
              {boards &&
                boards.map(board => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      dispatch(setBoard({title: board.title, id: board.id}));
                      navigation.navigate('Tasks');
                    }}
                    onLongPress={() => {
                      setCurrentBoard(board);
                      actionBoardSheetRef.current?.show();
                    }}>
                    <View style={[styles.drop, {marginLeft: 34}]}>
                      <View style={styles.icon}>
                        <AntDesign name="folderopen" size={28} color="#666" />
                      </View>
                      <View>
                        <View>
                          <AppText text={board.title} color="#000000" />
                        </View>
                        <View>
                          <AppText
                            tiny
                            text={board.description}
                            color="#666666"
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
            </>
          )}
        </>
      ))}
      <ActionSheet
        ref={actionSheetRef}
        onClose={async () => {
          await changeProjectDetails(currentProject.id, currentProject);
          let thisProject = [...project].find(
            task => task?.id === currentProject?.id,
          );
          if (!thisProject) return;
          thisProject = {...thisProject, ...currentProject};

          dispatch(
            loadProjects([
              ...[...projects].filter(task => task.id !== currentProject.id),
              thisProject,
            ]),
          );
        }}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Change Project Title" />
          </View>
          <View style={{padding: 10}}>
            <TextInput
              placeholder="Title"
              style={styles.textInput}
              onChangeText={(text: string) => {
                setCurrentProjects({...currentProject, title: text});
              }}
              value={currentProject.title}
            />
            {!currentProject.title && (
              <View>
                <AppText error tiny text="Provide a valid input" />
              </View>
            )}
          </View>
          <View style={{padding: 10}}>
            <AppText strong text="Change Project Description" />
          </View>
          <View style={{padding: 10}}>
            <TextInput
              placeholder="Description"
              style={styles.textInput}
              onChangeText={(text: string) => {
                setCurrentProjects({...currentProject, description: text});
              }}
              value={currentProject.description}
            />
          </View>
          <View style={{padding: 10}}>
            <AppText strong text="Actions" />
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                actionSheetRef.current?.hide();
                actionMemberSheetRef.current?.show();
              }}>
              <View style={{padding: 10, flexDirection: 'row'}}>
                <SimpleLineIcons name="user-follow" size={24} />
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <AppText text="Add New Members" />
                </View>
              </View>
            </TouchableWithoutFeedback>
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
      <ActionSheet
        ref={actionBoardSheetRef}
        onClose={async () => {
          await changeBoardDetails(currentBoard.id, currentBoard);
          let thisBoard = [...boards].find(
            board => board?.id === currentBoard?.id,
          );

          console.log(thisBoard, '******** thisBoard');
          if (!thisBoard) return;

          console.log('got here');
          thisBoard = {...thisBoard, ...currentBoard};

          setBoards([
            ...[...boards].filter(board => board.id !== currentBoard.id),
            thisBoard,
          ]);
        }}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Change Title" />
          </View>
          <View style={{padding: 10}}>
            <TextInput
              placeholder="Title"
              style={styles.textInput}
              onChangeText={(text: string) => {
                setCurrentBoard({...currentBoard, title: text});
              }}
              value={currentBoard.title}
            />
            {!currentBoard.title && (
              <View>
                <AppText error tiny text="Provide a valid input" />
              </View>
            )}
          </View>
          <View style={{padding: 10}}>
            <AppText strong text="Change Description" />
          </View>
          <View style={{padding: 10}}>
            <TextInput
              placeholder="Description"
              style={styles.textInput}
              onChangeText={(text: string) => {
                setCurrentBoard({...currentBoard, description: text});
              }}
              value={currentBoard.description}
            />
          </View>
          <View style={{padding: 10}}>
            <AppText strong text="Set Status" />
          </View>
          <View>
            {['Ongoing', 'Completed'].map(status => (
              <TouchableWithoutFeedback
                onPress={async () => {
                  setCurrentBoard({...currentBoard, status});
                }}>
                <View style={{padding: 10, flexDirection: 'row'}}>
                  <>
                    {status === currentBoard.status ? (
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
      <ActionSheet
        ref={actionMemberSheetRef}
        onClose={async () => {
          await saveTeamMembers(projects[active as number].id, projectMembers);
        }}>
        <View style={{marginBottom: 30}}>
          <View style={{padding: 10}}>
            <AppText strong text="Choose Team Member(s)" />
            <AppText
              tiny
              text="Close this sheet to make changes."
              color="#A0A0A0"
            />
          </View>
          <View>
            {[...allUsers].map(
              ({id, first_name, last_name, user_name, email}) => (
                <TouchableWithoutFeedback
                  onPress={async () => {
                    if (projectMembers.length > 0) {
                      if (projectMembers.find(pm => pm.id === id)) {
                        dispatch(
                          setProjectMembers(
                            [...projectMembers].filter(ass => ass.id !== id),
                          ),
                        );
                        return;
                      }
                      dispatch(
                        setProjectMembers([
                          ...projectMembers,
                          {id, last_name, first_name, user_name, email},
                        ]),
                      );
                      return;
                    }
                    dispatch(
                      setProjectMembers([
                        {id, last_name, first_name, user_name, email},
                      ]),
                    );
                  }}>
                  <View style={{padding: 10, flexDirection: 'row'}}>
                    <>
                      {[...projectMembers].find(us => us.id === id) ? (
                        <SimpleLineIcons name="check" size={24} />
                      ) : (
                        <Ionicons
                          name="md-radio-button-off-outline"
                          size={24}
                        />
                      )}
                      <View style={{width: 10}} />
                    </>
                    <View style={{justifyContent: 'center'}}>
                      <AppText text={`${last_name}, ${first_name}`} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ),
            )}
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
                console.log(currentBoard.id);
                const res = await changeBoardStatus(currentBoard.id, 'Deleted');
                if (!res) return;
                const thisBoard = [...boards].find(
                  board => board?.id === currentBoard?.id,
                );
                if (!thisBoard) return;
                thisBoard.status = 'Deleted';

                setBoards([
                  ...[...boards].filter(board => board.id !== currentBoard.id),
                  thisBoard,
                ]);

                setBoard({});
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
    </AppBody>
  );
};

export default Boards;

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
});
