import * as React from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import AppText from '../components/AppText';
import colors from '../settings/colors';
import AppButton from '../components/AppButton';
import AppBody from '../components/AppBody';
import { useValidation } from '../hooks/useValidation';
import { completeAuth } from '../services/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login } from '../redux/auth/slice';
import ActionSheet from 'react-native-actions-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { selectMembers } from '../redux/projects/slice';
import { saveTask } from '../services/project';
import { selectBoard } from '../redux/projects/slice';


const CreateTask = ({ navigation }) => {
    const [state, setState] = React.useState({
        loading: false,
        error: '',
    });
    const projectMembers = useAppSelector(selectMembers);
    const board = useAppSelector(selectBoard);


    const [openStartDate, setOpenStartDate] = React.useState(false);
    const [openEndDate, setOpenEndDate] = React.useState(false);
    const startDateRef = React.useRef(null);
    const endDateRef = React.useRef(null);

    const actionSheetRef = React.useRef(null);
    const actionMemberSheetRef = React.useRef(null);

    const [inputs, errors, blur, update, validate] = useValidation();
    const dispatch = useAppDispatch();

    const create = async () => {
        try {
            if (state.loading) {
                return;
            }
            setState({ ...state, loading: true });
            if (validate()) {
                const response = await saveTask(inputs, board.id);
                console.log(response);
                if (response) {
                    //save credentials
                    navigation.goBack();
                    setState({ ...state, loading: false });
                    return;
                }
            }
            setState({ ...state, loading: false });
        } catch (e) {
            setState({
                ...state,
                loading: false,
                error: e.message,
            });
        }
    };

    console.log(board.id)

    React.useEffect(() => {
        update("To-do", "status");
    }, []);

    const getNames = () => {
        if (!inputs?.assigned_to) return "";
        let concat = ""
        if (Array.isArray(inputs?.assigned_to)) {
            inputs?.assigned_to.map((id) => {
                concat += projectMembers.find(pm => id === pm.id).first_name + " " + projectMembers.find(pm => id === pm.id).last_name + "    "
            })
        }
        return concat
    }

    return (<>
        <AppBody title='Add New Task'>
            <View>
                <View style={styles.topic}>
                    <AppText text="Title" />
                </View>
                <TextInput
                    autoFocus
                    placeholder="What would you call the task?"
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
                {!!state?.error && (
                    <View>
                        <AppText error text={state?.error} />
                    </View>
                )}

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

                <View style={styles.topic}>
                    <AppText text="Assign to" />
                </View>
                <TextInput
                    placeholder="Assign task to"
                    style={styles.textInput}
                    onBlur={() => blur('assigned_to')}
                    onFocus={() => {
                        Keyboard.dismiss();
                        actionMemberSheetRef.current?.show();
                    }}
                    value={getNames()}
                />
                {!!errors?.assigned_to && (
                    <View>
                        <AppText error tiny text={errors?.assigned_to} />
                    </View>
                )}

                <View style={styles.space} />
                <View style={styles.topic}>
                    <AppText text="Start Date" />
                </View>
                <TextInput
                    ref={startDateRef}
                    placeholder="When will this task start?"
                    style={styles.textInput}
                    onBlur={() => blur('start')}
                    onFocus={() => {
                        startDateRef.current?.blur();
                        Keyboard.dismiss();
                        setOpenStartDate(true);
                    }}
                    value={inputs?.start}
                />
                {!!errors?.start && (
                    <View>
                        <AppText error tiny text={errors?.start} />
                    </View>
                )}
                <View style={styles.space} />
                <View style={styles.topic}>
                    <AppText text="End date" />
                </View>
                <TextInput
                    ref={endDateRef}
                    placeholder="When will this task end?"
                    style={styles.textInput}
                    onBlur={() => blur('end')}
                    onFocus={() => {
                        endDateRef.current?.blur();
                        Keyboard.dismiss();
                        setOpenEndDate(true);
                    }}
                    value={inputs?.end}
                />
                {!!errors?.end && (
                    <View>
                        <AppText error tiny text={errors?.end} />
                    </View>
                )}
                <View style={styles.space} />
                {!!state?.error && (
                    <View>
                        <AppText error text={state?.error} />
                    </View>
                )}
                <View style={styles.space} />
                <AppButton
                    text={state.loading ? 'Please wait...' : 'Create Task'}
                    action={create}
                />
            </View>
        </AppBody>
        <ActionSheet ref={actionSheetRef}>
            <View style={{ marginBottom: 30 }}>
                <View style={{ padding: 10 }}>
                    <AppText strong text="Set Task Status" />
                </View>
                <View>
                    {['To-do', 'In Progress', 'Quality Assurance', 'Done'].map(
                        status => (
                            <TouchableWithoutFeedback
                                onPress={async () => {
                                    update(status, "status");
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
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    <>
                                        {status === inputs?.status ? (
                                            <SimpleLineIcons name="check" size={24} />
                                        ) : (
                                            <Ionicons
                                                name="md-radio-button-off-outline"
                                                size={24}
                                            />
                                        )}
                                        <View width={10} />
                                    </>
                                    <View style={{ justifyContent: 'center' }}>
                                        <AppText text={status} />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        ),
                    )}
                </View>
            </View>
        </ActionSheet>
        <ActionSheet ref={actionMemberSheetRef}>
            <View style={{ marginBottom: 30 }}>
                <View style={{ padding: 10 }}>
                    <AppText strong text="Choose Team Member(s)" />
                </View>
                <View>
                    {projectMembers.map(
                        ({ id, first_name, last_name }) => (
                            <TouchableWithoutFeedback
                                onPress={async () => {
                                    if (Array.isArray(inputs?.assigned_to)) {
                                        if (inputs?.assigned_to.includes(id)) {
                                            update([...inputs?.assigned_to].filter(ass => ass !== id), "assigned_to")
                                            return;
                                        }
                                        update([...inputs?.assigned_to, id], "assigned_to");
                                        return;
                                    }
                                    update([id], 'assigned_to');
                                }}>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    <>
                                        {Array.isArray(inputs?.assigned_to) && inputs?.assigned_to.includes(id) ? (
                                            <SimpleLineIcons name="check" size={24} />
                                        ) : (
                                            <Ionicons
                                                name="md-radio-button-off-outline"
                                                size={24}
                                            />
                                        )}
                                        <View width={10} />
                                    </>
                                    <View style={{ justifyContent: 'center' }}>
                                        <AppText text={`${last_name}, ${first_name}`} />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        ),
                    )}
                </View>
            </View>
        </ActionSheet>
        {openStartDate && <DateTimePicker
            display='spinner'
            positiveButtonLabel="Choose"
            negativeButtonLabel='Cancel'
            value={inputs?.start ? new Date(inputs?.start) : new Date()}
            onChange={(event: DateTimePickerEvent, date) => {
                const {
                    type,
                    nativeEvent: { timestamp },
                } = event;
                if (type === "set") {
                    update(date.toISOString().substring(0, 10), "start");
                    setOpenStartDate(false);
                    return;
                }
                setOpenStartDate(false);
            }}
        />}
        {openEndDate && <DateTimePicker
            display='spinner'
            mode='date'
            positiveButton={{
                label: "Choose"
            }}
            negativeButton={{
                label: "Cancel"
            }}
            value={inputs?.end ? new Date(inputs?.end) : new Date()}
            onChange={(event: DateTimePickerEvent, date) => {
                const {
                    type,
                    nativeEvent: { timestamp },
                } = event;
                if (type === "set") {
                    update(date.toISOString().substring(0, 10), "end");
                    if (Platform.OS === 'android') {
                        setOpenEndDate(false);
                    }
                    return;
                }
                setOpenEndDate(false);
            }}
        />}
    </>
    );
};

export default CreateTask;

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
    space: { height: 8 },
    topic: {
        marginBottom: 10,
    },
});
