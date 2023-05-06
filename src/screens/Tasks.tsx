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
import {getTasksFromBoard} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectBoard, setTask} from '../redux/projects/slice';

const Tasks = ({navigation}) => {
  const [state, setState] = React.useState({
    loading: false,
  });

  const {colors} = useTheme();
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let response = await getTasksFromBoard(board.id);
      if (response) {
        setTasks(response);
      }
    })();
  }, []);

  return (
    <AppBody title={board.title || 'Tasks'} fullView>
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
      {tasks.map(task => {
        const {id, title, description} = task;
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(setTask({id, title}));
              navigation.navigate('Task');
            }}>
            <View style={styles.drop}>
              <View style={styles.icon}>
                <Feather name="briefcase" size={28} color={colors.icon} />
              </View>
              <View>
                <AppText text={title} />
                <AppText tiny text={description} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </AppBody>
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
});
