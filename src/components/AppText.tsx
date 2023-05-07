import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

type TextProps = {
  text: string;
  topic?: boolean;
  color?: string;
  tiny?: boolean;
  error?: boolean;
  strong?: boolean;
};

const AppText = ({
  text = '',
  topic = false,
  color,
  error,
  tiny,
  strong,
}: TextProps) => {
  const {colors} = useTheme();
  return (
    <Text
      style={[
        styles.text,
        strong ? styles.strong : {},
        tiny ? styles?.tiny : {},
        topic ? styles.topic : {},
        // eslint-disable-next-line react-native/no-inline-styles
        {color: error ? 'red' : color ? color : colors.text},
      ]}>
      {text}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: 'ClashGrotesk',
  },
  tiny: {
    fontSize: 13,
    fontFamily: 'ClashGrotesk',
  },
  strong: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'ClashGrotesk',
  },
  topic: {
    fontSize: 22,
    fontFamily: 'ClashGrotesk',
    fontWeight: '700',
  },
});
