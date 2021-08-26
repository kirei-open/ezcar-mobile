import React from 'react';
import { View } from 'react-native';
import { Text, Button, Icon, Separator } from 'native-base';

function renderRowWithoutButtons(item) {
  return (
    <View
      key={item.key}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12
      }}
    >
      {item.input}
    </View>
  );
}

function renderRowButton(button, stylesheet, style = {}) {
  const buttonOptions = {
    primary: style.primary || false,
    info: style.info || false,
    bordered: style.bordered || false,
    danger: style.danger || false,
    block: style.block || false,
    iconLeft: style.iconLeft || false
  };

  let ButtonIcon = null;
  let ButtonLabel = null;

  switch (button.type) {
    case 'add':
      buttonOptions.info = true;
      buttonOptions.block = true;
      buttonOptions.iconLeft = true;
      ButtonLabel = <Text>Add</Text>;
      ButtonIcon = <Icon name="add" />;
      break;
    case 'remove':
      buttonOptions.danger = true;
      ButtonIcon = <Icon name="trash" />;
      break;
    case 'move-up':
      buttonOptions.bordered = true;
      ButtonIcon = <Icon name="arrow-up" />;
      break;
    case 'move-down':
      buttonOptions.bordered = true;
      ButtonIcon = <Icon name="arrow-down" />;
      break;
    default:
      break;
  }

  return (
    <Button key={button.type} {...buttonOptions} onPress={button.click}>
      {ButtonIcon}
      {ButtonLabel}
    </Button>
  );
}

function renderButtonGroup(buttons, stylesheet) {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 6 }}>
      {buttons.map(button => (
        <View key={button.type} style={{ flex: 1 }}>
          {renderRowButton(button, stylesheet, { width: 50, block: true })}
        </View>
      ))}
    </View>
  );
}

function renderRow(item, stylesheet) {
  return (
    <View
      key={item.key}
      style={{
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12
      }}
    >
      <View style={{ flex: 1 }}>{item.input}</View>
      <View style={{ flex: 1 }}>
        {renderButtonGroup(item.buttons, stylesheet)}
      </View>
    </View>
  );
}

function myList(locals) {
  if (locals.hidden) {
    return null;
  }

  const { stylesheet } = locals;
  const fieldsetStyle = stylesheet.fieldset;
  let controlLabelStyle = stylesheet.controlLabel.normal;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  const label = locals.label ? (
    <Separator bordered>
      <Text style={{ ...controlLabelStyle, fontSize: 12 }}>{locals.label}</Text>
    </Separator>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={stylesheet.errorBlock}>
        {locals.error}
      </Text>
    ) : null;

  if (locals.config.labelType === 'checkList') {
    const { labelName } = locals.config;
    locals.items.forEach((item, index) => {
      item.input.props.ctx.label = labelName[index].name;
    });
  } else if (locals.config.disableLabel) {
    locals.items.forEach((item, index) => {
      item.input.props.ctx.label = '';
    });
  }

  const rows = locals.items.map(
    item =>
      item.buttons.length === 0
        ? renderRowWithoutButtons(item)
        : renderRow(item, stylesheet)
  );

  const addButton = locals.add ? renderRowButton(locals.add, stylesheet) : null;

  return (
    <View style={fieldsetStyle}>
      {label}
      {error}
      {rows}
      {addButton}
    </View>
  );
}

export default myList;
