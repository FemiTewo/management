import React from 'react';
import Login from './src/screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from './src/redux/hooks';
import {selectIsLoggedIn} from './src/redux/auth/slice';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/screens/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {selectTheme} from './src/redux/settings/slice';
import {DarkModeTheme, LightModeTheme} from './src/settings/themes';
import Boards from './src/screens/Boards';
import Tasks from './src/screens/Tasks';
import Task from './src/screens/Task';
import CreateTask from './src/screens/CreateTask';
import CreateBoard from './src/screens/CreateBoard';
import CreateProject from './src/screens/CreateProject';
import CreateAccount from './src/screens/CreateAccount';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const tabs = [
  // {
  //   name: 'Home',
  //   component: Home,
  //   icon: {focused: 'ios-home', plain: 'ios-home-outline'},
  // },
  // {
  //   name: 'Projects',
  //   component: Team,
  //   icon: {focused: 'ios-folder-open', plain: 'ios-folder-open-outline'},
  // },
  {
    name: 'Boards',
    component: Boards,
    icon: {focused: 'ios-clipboard', plain: 'ios-clipboard-outline'},
  },
  {
    name: 'Settings',
    component: Settings,
    icon: {focused: 'ios-settings', plain: 'ios-settings-outline'},
  },
];

const HomeTabNav = (theme: 'light' | 'dark') => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        iconName = focused
          ? tabs.find(tab => tab.name === route.name)?.icon.focused
          : tabs.find(tab => tab.name === route.name)?.icon.plain;

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarShowLabel: false,
    })}
    tabBarOptions={{
      activeTintColor:
        theme === 'light'
          ? LightModeTheme.colors.bottomIcon.active
          : DarkModeTheme.colors.bottomIcon.active,
      inactiveTintColor:
        theme === 'light'
          ? LightModeTheme.colors.bottomIcon.inactive
          : DarkModeTheme.colors.bottomIcon.inactive,
    }}>
    {tabs.map(tab => (
      <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
    ))}
  </Tab.Navigator>
);

const App = () => {
  const isAuthenticated = useAppSelector(selectIsLoggedIn);
  const theme = useAppSelector(selectTheme);
  return (
    <NavigationContainer
      theme={theme === 'light' ? LightModeTheme : DarkModeTheme}>
      {!isAuthenticated ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="MainHome" component={() => HomeTabNav(theme)} />
          <Stack.Screen name="Tasks" component={Tasks} />
          <Stack.Screen name="Task" component={Task} />
          <Stack.Screen name="CreateTask" component={CreateTask} />
          <Stack.Screen name="CreateBoard" component={CreateBoard} />
          <Stack.Screen name="CreateProject" component={CreateProject} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default AppWrapper;
