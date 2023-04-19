import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppText from './AppText';
type ReactText = string | number;
type ReactChild = React.ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode =
  | ReactChild
  | ReactFragment
  | React.ReactPortal
  | boolean
  | null
  | undefined;

interface AppBodyProp {
  children: ReactNode;
  title?: string;
}

const AppBody = ({
  children,
  title = 'Project Manager',
}: React.PropsWithChildren<AppBodyProp>) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={[backgroundStyle, styles.safeAreaView]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollview}
        style={backgroundStyle}>
        <View style={styles.container}>
          <View>
            <View>
              <AppText text={title} topic />
            </View>
            <View>{children}</View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppBody;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    justifyContent: 'center',
  },
  scrollview: {
    flexGrow: 1,
  },
  safeAreaView: {flex: 1},
});
