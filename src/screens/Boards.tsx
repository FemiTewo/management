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
import {useTheme} from '@react-navigation/native';
import {getBoards, getProjects} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectUserData} from '../redux/auth/slice';
import {loadProjects, selectProjects, setBoard} from '../redux/projects/slice';

const Boards = ({navigation}) => {
  const [active, setActive] = React.useState<number | null>();
  const [boards, setBoards] = React.useState([]);
  const [state, setState] = React.useState({
    projectLoading: false,
    boardLoading: false,
  });

  const {colors} = useTheme();
  const user = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);

  React.useEffect(() => {
    (async () => {
      setState({...state, projectLoading: true});
      let response = await getProjects(user.id);
      if (response) {
        dispatch(loadProjects(response));
      }
      setState({...state, projectLoading: false});
    })();
  }, []);

  React.useEffect(() => {
    if (!active && active !== 0) return;
    (async () => {
      setState({...state, boardLoading: true});
      let response = await getBoards(projects[active].id);
      if (response) {
        setBoards(response);
      }
      setState({...state, boardLoading: false});
    })();
  }, [active]);

  return (
    <AppBody title="Boards" fullView>
      {state?.loading && <ActivityIndicator />}

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
                <Feather name="briefcase" size={28} color={colors.icon} />
              </View>
              <View>
                <AppText text={project.title} />
                <AppText tiny text={project.description} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {state.boardLoading && (
            <View style={[styles.drop, {marginLeft: 34}]}>
              <ActivityIndicator />
            </View>
          )}
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
                        <Feather
                          name="clipboard"
                          size={24}
                          color={colors.icon}
                        />
                      </View>
                      <View>
                        <AppText text={board.title} />
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
