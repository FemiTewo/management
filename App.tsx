import React from 'react';
import Login from './src/screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from './src/redux/hooks';
import {selectIsLoggedIn} from './src/redux/auth/slice';
import Home from './src/screens/Home';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import SignUp from './src/screens/SignUp';

const Stack = createNativeStackNavigator();

const App = () => {
  const isAuthenticated = useAppSelector(selectIsLoggedIn);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated && (
          <>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="signup" component={SignUp} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Stack.Screen name="home" component={Home} />
          </>
        )}
      </Stack.Navigator>
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
