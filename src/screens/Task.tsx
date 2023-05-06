import * as React from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import AppText from '../components/AppText';
import AppBody from '../components/AppBody';
import {useTheme} from '@react-navigation/native';
import {getItemsFromTask} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectProjects, selectTask} from '../redux/projects/slice';
import {DefaultProfileImage} from '../components/utils';

const Task = ({navigation}) => {
  const [messages, setMessages] = React.useState([]);
  const [state, setState] = React.useState({
    taskLoading: false,
  });

  const dispatch = useAppDispatch();
  const task = useAppSelector(selectTask);

  React.useEffect(() => {
    (async () => {
      setState({...state, taskLoading: true});
      let response = await getItemsFromTask(task.id);
      if (response) {
        setMessages(response);
      }
      setState({...state, taskLoading: false});
    })();
  }, [task.id]);

  console.log(messages);

  return (
    <AppBody title={task.title} fullView>
      {state?.loading && <ActivityIndicator />}

      <View style={styles.space} />

      <View style={styles.space} />
      {state.taskLoading && (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={[styles.drop, {marginLeft: 34}]}>
          <ActivityIndicator />
        </View>
      )}
      <ScrollView>
        {messages &&
          messages.map(mess => {
            const {userReference, message, tagReference} = mess;
            const {first_name, last_name} = userReference;
            const {initials, match} = DefaultProfileImage(
              first_name,
              last_name,
            );
            return (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: match,
                    marginRight: 10,
                  }}>
                  <AppText color="white" text={initials} />
                </View>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{justifyContent: 'center', paddingLeft: 10}}>
                  <AppText strong text={`${first_name} ${last_name}`} />
                  <View style={{paddingVertical: 10}}>
                    <AppText text={message} />
                  </View>
                  <ScrollView horizontal>
                    {(
                      tagReference as {
                        first_name: string;
                        last_name: string;
                      }[]
                    ).length > 0 && (
                      <>
                        {(
                          tagReference as {
                            first_name: string;
                            last_name: string;
                          }[]
                        )?.map(({first_name: fname, last_name: lname}) => (
                          <View
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                              backgroundColor: 'grey',
                              marginRight: 5,
                              borderRadius: 2,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                            }}>
                            <AppText
                              tiny
                              color="white"
                              text={`${fname} ${lname}`}
                            />
                          </View>
                        ))}
                      </>
                    )}
                  </ScrollView>
                  <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'grey',
                      paddingTop: 10,
                      marginBottom: 10,
                    }}
                  />
                </View>
              </View>
            );
          })}
      </ScrollView>
    </AppBody>
  );
};

export default Task;

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
