import React from 'react'

const TabIcon = (props) => {
    return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Icon
          color={props.tintColor}
          name={props.iconName}
          size={26}
          />
      </View>
    </View>
    )
  }
  
  const styles = {
    container: {
      width: 48,
      height: 42,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }
  };
  
  export default TabIcon