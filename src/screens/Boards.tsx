import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {getBoards, getProjects} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';
import {
  loadProjects,
  selectProjects,
  setBoard,
  setProjectMembers,
} from '../redux/projects/slice';

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

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setState({...state, projectLoading: true});
        let response = await getProjects(user.id);
        console.log(response, 'new response');
        if (response) {
          dispatch(loadProjects(response));
        }
        setState({...state, projectLoading: false});
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
      </View>
      <View style={styles.space} />
      {state.projectLoading && (
        <View style={styles.drop}>
          <ActivityIndicator />
        </View>
      )}
      {projects.map((project, index) => (
        <>
          <TouchableWithoutFeedback
            onPress={() =>
              active === index ? setActive(null) : setActive(index)
            }>
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
    </AppBody>
  );
};

export default Boards;

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
});
