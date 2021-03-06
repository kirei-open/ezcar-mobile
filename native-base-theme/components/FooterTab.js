import { Platform } from 'react-native';

import variable from './../variables/commonColor';

export default (variables = variable) => {
  const { platform } = variables;

  const footerTabTheme = {
    'NativeBase.Button': {
      '.active': {
        'NativeBase.Text': {
          color: variables.brandPrimary,
          fontSize: variables.tabBarTextSize,
          lineHeight: 16
        },
        'NativeBase.Icon': {
          color: variables.brandPrimary
        },
        'NativeBase.IconNB': {
          color: variables.brandPrimary
        },
        backgroundColor: 'rgba(255,255,255,0.1)'
      },
      flexDirection: null,
      backgroundColor: 'white',
      borderColor: null,
      elevation: 0,
      shadowColor: null,
      shadowOffset: null,
      shadowRadius: null,
      shadowOpacity: null,
      alignSelf: 'center',
      flex: 1,
      height: variables.footerHeight - (variables.isIphoneX ? 34 : 0),
      justifyContent: 'center',
      '.badge': {
        'NativeBase.Badge': {
          'NativeBase.Text': {
            fontSize: 11,
            fontWeight: platform === 'ios' ? '600' : undefined,
            lineHeight: 14
          },
          top: -3,
          alignSelf: 'center',
          left: 10,
          zIndex: 99,
          height: 18,
          padding: 1.7,
          paddingHorizontal: 3
        },
        'NativeBase.Icon': {
          marginTop: -18
        }
      },
      'NativeBase.Icon': {
        color: variables.textColor
      },
      'NativeBase.IconNB': {
        color: variables.textColor
      },
      'NativeBase.Text': {
        color: variables.textColor,
        fontSize: variables.tabBarTextSize,
        lineHeight: 16
      }
    },
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignSelf: 'stretch'
  };

  return footerTabTheme;
};
