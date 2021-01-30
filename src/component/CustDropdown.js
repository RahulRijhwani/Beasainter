import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';
import config from '../config';
// import Dropdown  from 'react-native-material-dropdown';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import {Chevron} from 'react-native-shapes';
export default class CustDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currInd: 0};
    this.setState({
      favSport3: null,
      update: [ ],
     
    });
  }
  componentDidMount() {
    var year = new Date().getFullYear();
    this.setState({favSport3: year});
   
  }
  
  render() {
    const {
      containerStyle,
      data,
      placeholder,
      onPress,
      Value,
      disabled
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, {...containerStyle}]}>
        <RNPickerSelect
        disabled={!!disabled?disabled:false}
          placeholder={{
            label: placeholder,
            value: null,
            color: '#9EA0A4',
          }}
          items={data}
          onValueChange={(value) => {
            
            this.setState({
              favSport3: value,
            });
           
            this.props.onChange(value);
            
          }}
          style={{
            // inputAndroid: {
            //   backgroundColor: config.Constant.COLOR_WHITE,
            // },
            ...pickerSelectStyles,
            iconContainer: {
              top: 15,
              right: 20,
            },
          }}
          value={this.state.favSport3 && Value}
          useNativeAndroidPickerStyle={false}
          //   textInputProps={{underlineColorAndroid: 'cyan'}}
          Icon={() => {
            return <Chevron size={1.5} color={config.Constant.COLOR_BLACK} />;
          }}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
		borderColor: config.Constant.COLOR_PRIMARY,
		backgroundColor: 'white',
		marginTop: 5,
		width: '100%',
		//padding: 5,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    fontFamily: config.Constant.FONT_SEMI_BOLD,
    borderRadius: 4,
    color: config.Constant.COLOR_BLACK,
    height: 40,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,

    fontFamily: config.Constant.FONT_SEMI_BOLD,
    borderRadius: 4,
    color: config.Constant.COLOR_BLACK,
    height: 40,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
