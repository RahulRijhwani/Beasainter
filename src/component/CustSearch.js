import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import config from '../config';

export default class CustSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currInd: 0,
      value: '',
      selection: {
        start: 0,
        end: 0,
      },
    };
  }

  render() {
    const {
      containerStyle,
      textContainerStyle,
      title,
      value,
      onChangeText,
      keyboardType,
    } = this.props;
    // const {selection} = this.state;
    return (
      <View
        // pointerEvents={editable != undefined && editable == false ? 'none' : 'auto'}
        style={[styles.container, {...containerStyle}]}>
        <TextInput
          placeholder={'Search'}
          onChangeText={!!onChangeText ? onChangeText : () => {}}
		  value={!!value && value}
		  placeholderTextColor={'rgba(255,255,255,0.3)'}
          style={styles.inputStyle}
        />
        <TouchableOpacity
          style={{
            backgroundColor: config.Constant.COLOR_PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
          }}>
          <Image
            source={require('../assets/images/searchIcon.png')}
            resizeMode={'contain'}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: config.Constant.COLOR_PRIMARY,
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    borderWidth: 1,
    borderRadius: 50,
  },
  txtStyle: {
    fontSize: 18,
    color: config.Constant.COLOR_WHITE,
  },
  inputStyle: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 18,
    paddingHorizontal: 10,
    flex: 1,
	paddingVertical: 0,
	borderBottomWidth:1,
	borderColor:'white'
  },
});
