import React from 'react';
import { View, Text } from 'react-native';
import { Left, Right, Item, Input } from 'native-base';

function myTextbox(locals) {
  if (locals.hidden) {
    return null;
  }

  const { stylesheet } = locals;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let textboxStyle = stylesheet.textbox.normal;
  let textboxViewStyle = stylesheet.textboxView.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    textboxViewStyle = stylesheet.textboxView.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
    textboxViewStyle = stylesheet.textboxView.notEditable;
  }

  const label = locals.label ? (
    <Left
      style={{
        flex: locals.keyboardType === 'numeric' ? 0.5 : 1,
        alignSelf: 'flex-start'
      }}
    >
      <Text style={controlLabelStyle}>{locals.label}</Text>
    </Left>
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

  const viewTextStyle = {
    ...formGroupStyle
  };

  if (locals.keyboardType === 'numeric') {
    viewTextStyle.flex = 1;
    viewTextStyle.flexDirection = 'row';
    textboxViewStyle.flex = 0.5;
    textboxViewStyle.marignBottom = 0;
  }

  return (
    <View style={formGroupStyle}>
      <View style={viewTextStyle}>
        {label}
        <Right style={textboxViewStyle}>
          <Item style={{ height: 'auto' }}>
            <Input
              accessibilityLabel={locals.label}
              ref="input"
              autoCapitalize={locals.autoCapitalize}
              autoCorrect={locals.autoCorrect}
              autoFocus={locals.autoFocus}
              blurOnSubmit={locals.blurOnSubmit}
              editable={locals.editable}
              keyboardType={locals.keyboardType}
              maxLength={locals.maxLength}
              multiline={locals.multiline}
              onBlur={locals.onBlur}
              onEndEditing={locals.onEndEditing}
              onFocus={locals.onFocus}
              onLayout={locals.onLayout}
              onSelectionChange={locals.onSelectionChange}
              onSubmitEditing={locals.onSubmitEditing}
              onContentSizeChange={locals.onContentSizeChange}
              placeholderTextColor={locals.placeholderTextColor}
              secureTextEntry={locals.secureTextEntry}
              selectTextOnFocus={locals.selectTextOnFocus}
              selectionColor={locals.selectionColor}
              numberOfLines={locals.numberOfLines}
              underlineColorAndroid={locals.underlineColorAndroid}
              clearButtonMode={locals.clearButtonMode}
              clearTextOnFocus={locals.clearTextOnFocus}
              enablesReturnKeyAutomatically={
                locals.enablesReturnKeyAutomatically
              }
              keyboardAppearance={locals.keyboardAppearance}
              onKeyPress={locals.onKeyPress}
              returnKeyType={locals.returnKeyType}
              selectionState={locals.selectionState}
              onChangeText={value => locals.onChange(value)}
              onChange={locals.onChangeNative}
              placeholder={locals.placeholder}
              value={locals.value}
            />
          </Item>
        </Right>
      </View>
      {help}
      {error}
    </View>
  );
}

export default myTextbox;
