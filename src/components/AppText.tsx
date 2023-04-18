import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../settings/colors';

type TextProps = {
  text: string;
  topic?: boolean;
  error?: boolean;
  color?: string;
};

const AppText = ({
  text = '',
  topic = false,
  error = false,
  color = 'black',
}: TextProps) => {
  return (
    <Text
      style={[
        styles.text,
        topic ? styles.topic : {},
        error ? styles.error : {},
        {color},
      ]}>
      {text}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'GFSNeohellenic-Regular',
  },
  topic: {
    fontSize: 20,
    fontFamily: 'GFSNeohellenic-Bold',
  },
  error: {
    color: colors.error,
  },
});
