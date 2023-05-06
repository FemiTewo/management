import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import {light} from './light';
import {dark} from './dark';

export const LightModeTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...light,
  },
};

export const DarkModeTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...dark,
  },
};

export type AppThemeType = keyof typeof LightModeTheme;
