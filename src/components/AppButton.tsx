import * as React from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import colors from '../settings/colors';

interface AppButtonProps {
  text: string;
  action: () => void;
  alternate?: boolean;
}

const AppButton = ({text, action, alternate}: AppButtonProps) => {
  return (
    <TouchableWithoutFeedback onPress={action}>
      <View style={alternate ? styles.alternateContainer : styles.container}>
        <Text
          style={[
            styles.text,
            {
              color: alternate
                ? colors.button.backgroundColor
                : colors.appWhite,
            },
          ]}>
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.button.backgroundColor,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alternateContainer: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.button.backgroundColor,
    borderWidth: 1,
  },
  text: {
    color: 'white',
    fontFamily: 'GFSNeohellenic-Bold',
  },
});
