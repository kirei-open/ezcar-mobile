import React from 'react';
import { View, Switch } from 'react-native';
import { Text, Left, Right } from 'native-base';

function mySwitch(locals) {
  if (locals.hidden) {
    return null;
  }

  const { stylesheet, config } = locals;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let checkboxStyle = stylesheet.checkbox.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (
    locals.label === 'Action (optional)' &&
    config.labelType === 'checkList'
    // locals.label === 'Action'
  ) {
    locals.label = config.labelName[locals.path[1]].actionName;
  }

  const label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  const help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={{ ...formGroupStyle, flexDirection: 'row' }}>
      <Left>
        {label}
        {help}
        {error}
      </Left>
      <Right>
        <Switch
          accessibilityLabel={locals.label}
          ref="input"
          disabled={locals.disabled}
          onTintColor={locals.onTintColor}
          thumbTintColor={locals.thumbTintColor}
          tintColor={locals.tintColor}
          style={checkboxStyle}
          onValueChange={value => locals.onChange(value)}
          value={locals.value}
        />
      </Right>
    </View>
  );
}

export default mySwitch;
