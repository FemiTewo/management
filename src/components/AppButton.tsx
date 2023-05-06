import * as React from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface AppButtonProps {
  text: string;
  action: () => void;
  alternate?: boolean;
  icon?: JSX.Element | JSX.Element[];
}

const AppButton = ({text, action, alternate, icon}: AppButtonProps) => {
  const {colors} = useTheme();
  return (
    <TouchableWithoutFeedback onPress={action}>
      <View
        style={
          alternate
            ? {
                ...styles.alternateContainer,
                backgroundColor: colors.button.alternateBackground,
                borderColor: colors.button.alternateBorder,
              }
            : {...styles.container, backgroundColor: colors.button.background}
        }>
        {icon}
        <View>
          <Text
            style={[
              styles.text,
              {
                color: alternate
                  ? colors.button.alternateText
                  : colors.button.text,
              },
            ]}>
            {text}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  alternateContainer: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontFamily: 'ClashGrotesk',
    fontWeight: '700',
  },
});
