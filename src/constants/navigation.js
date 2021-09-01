import Colors from '../../native-base-theme/variables/commonColor';

export default {
  navbarProps: {
    navigationBarStyle: { backgroundColor: 'white' },
    titleStyle: {
      color: Colors.textColor,
      alignSelf: 'center',
      letterSpacing: 2,
      fontSize: Colors.fontSizeBase
    },
    backButtonTintColor: Colors.textColor
  },

  tabProps: {
    lazy: true,
    swipeEnabled: false,
    activeBackgroundColor: 'rgba(255,255,255,0.1)',
    activeTintColor: Colors.brandPrimary,
    inactiveBackgroundColor: Colors.brandLight,
    inactiveTintColor: Colors.textColor,
    tabBarStyle: { backgroundColor: Colors.brandLight }
  },

  icons: {
    style: { color: 'white' }
  }
};
