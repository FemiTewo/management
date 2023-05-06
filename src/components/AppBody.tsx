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
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../redux/hooks';
import {selectTheme} from '../redux/settings/slice';
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
  fullView?: boolean;
}

const AppBody = ({
  children,
  title = 'Project Manager',
  fullView,
}: React.PropsWithChildren<AppBodyProp>) => {
  const theme = useAppSelector(selectTheme);
  const {colors} = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeAreaView, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollview}
        // style={backgroundStyle}
      >
        <View
          style={[
            styles.container,
            {justifyContent: fullView ? 'flex-start' : 'center'},
          ]}>
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
  },
  scrollview: {
    flexGrow: 1,
  },
  safeAreaView: {flex: 1},
});
