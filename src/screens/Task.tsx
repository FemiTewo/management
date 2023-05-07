import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import AppText from '../components/AppText';
import AppBody from '../components/AppBody';
import {useTheme} from '@react-navigation/native';
import {getItemsFromTask, saveMessage} from '../services/project';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {selectMembers, selectTask} from '../redux/projects/slice';
import {DefaultProfileImage} from '../components/utils';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import AppButton from '../components/AppButton';
import {selectUserData} from '../redux/auth/slice';

type ItemProps = {title: string; selected: boolean; action: () => void};

const Item = ({title, selected, action}: ItemProps) => (
  <TouchableWithoutFeedback onPress={action} style={{backgroundColor: 'red'}}>
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: selected ? 'green' : 'gainsboro',
        marginRight: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginVertical: 1,
        height: 30,
        borderRadius: 10,
      }}>
      <AppText tiny text={title} color={selected ? 'white' : 'black'} />
    </View>
  </TouchableWithoutFeedback>
);

const Task = ({navigation}) => {
  const [messages, setMessages] = React.useState([]);
  const [state, setState] = React.useState({
    taskLoading: false,
  });
  const [taggedMembers, setTaggedMembers] = React.useState<string[]>([]);

  const projectMembers = useAppSelector(selectMembers);
  const [textInput, setTextInput] = React.useState('');

  const user = useAppSelector(selectUserData);

  const dispatch = useAppDispatch();
  const task = useAppSelector(selectTask);
  const getItems = async () => {
    setState({...state, taskLoading: true});
    let response = await getItemsFromTask(task.id);
    if (response) {
      setMessages(response);
    }
    setState({...state, taskLoading: false});
  };

  React.useEffect(() => {
    (async () => {
      await getItems();
    })();
  }, []);

  const {colors} = useTheme();
  const [tagging, setTagging] = useState(false);

  return (
    <AppBody title={task.title} fullView>
      <View style={styles.space} />
      <View style={styles.space} />
      {state.taskLoading && (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={[styles.drop, {marginLeft: 34}]}>
          <ActivityIndicator />
        </View>
      )}
      <ScrollView
        style={{
          height: Dimensions.get('window').height - 200,
        }}>
        <View style={{justifyContent: 'flex-start'}}>
          {messages.length === 0 && (
            <AppText text="Send a message to start a conversation." />
          )}
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
                      height: 40,
                      width: 40,
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
                                strong
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
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setTagging(!tagging);
            }}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                padding: 8,
                margin: 5,
                borderWidth: 1,
                borderColor: 'gainsboro',
                borderRadius: 10,
                backgroundColor: tagging ? 'grey' : 'white',
              }}>
              <AppText
                tiny
                color={tagging ? 'white' : 'black'}
                text="Tag Someone"
              />
            </View>
          </TouchableWithoutFeedback>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {[...projectMembers]
                .filter(m => m.id !== user.id)
                .map(member => {
                  return (
                    (tagging || taggedMembers.includes(member.id)) && (
                      <Item
                        selected={taggedMembers.includes(member.id)}
                        action={() => {
                          if (taggedMembers.includes(member.id)) {
                            setTaggedMembers(
                              [...taggedMembers].filter(
                                memberId => memberId !== member.id,
                              ),
                            );
                            return;
                          }
                          setTaggedMembers([...taggedMembers, member.id]);
                        }}
                        title={`${member.first_name} ${member.last_name}`}
                      />
                    )
                  );
                })}
            </View>
          </ScrollView>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <AutoGrowingTextInput
              placeholder="Type a message"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                paddingHorizontal: 10,
                backgroundColor: colors.textInput.backgroundColor,
                borderWidth: 1,
                borderColor: colors.textInput.borderColor,
                borderRadius: 12,
              }}
              value={textInput}
              onChangeText={(text: string) => {
                setTextInput(text);
              }}
            />
          </View>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <View>
              <AppButton
                text="Send"
                action={async () => {
                  const res = await saveMessage(
                    textInput,
                    taggedMembers,
                    user.id,
                    task.id,
                  );
                  if (res) {
                    setTextInput('');
                    setTaggedMembers([]);
                    await getItems();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
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
