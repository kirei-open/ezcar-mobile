import t from 'tcomb-form-native';
import { Platform } from 'react-native';
import Color from '../../native-base-theme/variables/commonColor';

const LABEL_COLOR = Color.inputColorPlaceholder;
const LABEL_FONT_SIZE = 15;
const INPUT_COLOR = Color.inputColor;
const ERROR_COLOR = Color.brandDanger;
const HELP_COLOR = Color.listNoteColor;
const BORDER_COLOR = Color.inputBorderColor;
const DISABLED_COLOR = Color.btnDisabledBg;
const DISABLED_BACKGROUND_COLOR = Color.cardBorderColor;
const FONT_SIZE = Color.inputFontSize;
const FONT_WEIGHT = '500';
const INPUT_HEIGHT = Color.inputHeightBase;
const BORDER_RADIUS = Color.borderRadiusBase;

const newStyleSheet = {
  fieldset: {
    marginBottom: 12
  },
  formGroup: {
    normal: {
      marginBottom: 5
    },
    error: {
      marginBottom: 5
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: LABEL_FONT_SIZE,
      marginBottom: 2,
      fontWeight: '400'
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: LABEL_FONT_SIZE,
      marginBottom: 2,
      fontWeight: FONT_WEIGHT
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: LABEL_FONT_SIZE,
      marginBottom: 2
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: LABEL_FONT_SIZE,
      marginBottom: 2
    }
  },
  errorBlock: {
    fontSize: LABEL_FONT_SIZE,
    marginBottom: 2,
    color: ERROR_COLOR
  },
  textboxView: {
    normal: {},
    error: {},
    notEditable: {}
  },
  textbox: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: INPUT_HEIGHT,
      paddingVertical: Platform.OS === 'ios' ? 7 : 0,
      paddingHorizontal: 7,
      borderRadius: BORDER_RADIUS,
      borderColor: BORDER_COLOR,
      borderWidth: 0,
      borderBottomWidth: 1,
      marginBottom: 5
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      height: INPUT_HEIGHT,
      paddingVertical: Platform.OS === 'ios' ? 7 : 0,
      paddingHorizontal: 7,
      borderRadius: BORDER_RADIUS,
      borderColor: ERROR_COLOR,
      borderWidth: 1,
      marginBottom: 5
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      height: INPUT_HEIGHT,
      paddingVertical: Platform.OS === 'ios' ? 7 : 0,
      paddingHorizontal: 7,
      borderRadius: BORDER_RADIUS,
      borderColor: BORDER_COLOR,
      borderWidth: 1,
      marginBottom: 5,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR
    }
  },
  checkbox: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  },
  pickerContainer: {
    normal: {
      marginBottom: 4,
      borderRadius: BORDER_RADIUS,
      borderColor: BORDER_COLOR,
      borderWidth: 1
    },
    error: {
      marginBottom: 4,
      borderRadius: BORDER_RADIUS,
      borderColor: ERROR_COLOR,
      borderWidth: 1
    },
    open: {
      // Alter styles when select container is open
    }
  },
  select: {
    normal: Platform.select({
      android: {
        paddingLeft: 7,
        color: INPUT_COLOR
      },
      ios: {}
    }),
    // the style applied when a validation error occours
    error: Platform.select({
      android: {
        paddingLeft: 7,
        color: ERROR_COLOR
      },
      ios: {}
    })
  },
  pickerTouchable: {
    normal: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    },
    error: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    },
    active: {
      borderBottomWidth: 1,
      borderColor: BORDER_COLOR
    }
  },
  pickerValue: {
    normal: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    },
    error: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    }
  },
  datepicker: {
    normal: {
      marginBottom: 4
    },
    // the style applied when a validation error occours
    error: {
      marginBottom: 4
    }
  },
  dateTouchable: {
    normal: {},
    error: {}
  },
  dateValue: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      padding: 7,
      marginBottom: 5
    },
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      padding: 7,
      marginBottom: 5
    }
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: INPUT_HEIGHT,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
};

t.form.Form.stylesheet = newStyleSheet;

export default newStyleSheet;
