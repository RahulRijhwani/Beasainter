import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {getStatusBarHeight, isIphoneX} from '../Util/Utilities';
import config from '../config';
import FastImage from 'react-native-fast-image';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
    setInterval(() => {
      this.setState({refresh: true});
    }, 5000);
  }
  static defaultProps = {
    containerStyle: {},
  };
  render() {
    const {
      viewStyle,
      txtStyle,
      title,
      onPressLeft,
      onPressRight,
      isMenu,
      Navigation,
      containerStyle,
      balance = false,
    } = this.props;
    return (
      <View
        onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          config.Constant.viewHeight = height;
        }}
        style={[
          styles.containerStyle,
          {
            ...containerStyle,
            paddingBottom: !!config.Constant.is_profile_pending ? 0 : 10,
          },
        ]}>
        <TouchableOpacity
          style={[styles.btnView, {marginLeft: 10}]}
          onPress={() => {
            onPressLeft && onPressLeft();
          }}>
          {onPressLeft && (
            <Image
              source={
                !!isMenu
                  ? require('../assets/images/openMenu.png')
                  : require('../assets/images/arrow-ios-back.png')
              }
              resizeMode={'contain'}
              style={{
                width: !!isMenu ? '50%' : '50%',
                height: !!isMenu ? '50%' : '50%',
                tintColor: 'white',
              }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={styles.text}>{title}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btnView, {marginLeft: 0,marginRight:10}]}
          onPress={() => {
            onPressRight && onPressRight();
          }}>
          {onPressRight && (
            <Image
              source={require('../assets/images/addBlack.png')
              }
              resizeMode={'contain'}
              style={{
                width: !!isMenu ? '50%' : '50%',
                height: !!isMenu ? '50%' : '50%',
                tintColor: 'white',
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: config.Constant.COLOR_PRIMARY,
    paddingHorizontal: 0,
    paddingTop:
      Platform.OS == 'ios'
        ? getStatusBarHeight() + 5
        : getStatusBarHeight() + 10,
    paddingBottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    marginBottom: 0,
    fontSize: 18,
    color: 'white',
  },
  blanceText: {
    marginBottom: 0,
    fontSize: 18,
    color: 'white',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 50,
    backgroundColor: config.Constant.COLOR_PRIMARY,
    marginRight: 15,
  },
  btnView: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
