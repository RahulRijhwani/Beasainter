import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ScrollView,
  Image,
  Linking,
} from 'react-native';

import Config from '../config/index';
import {getStatusBarHeight} from '../Util/Utilities';
import config from '../config/index';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CustDrawer extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    popupDisplay: false,
    imageChange: true,
    dialogVisible: false,
  };

  render() {
    const userImage = '';
    return (
      <View style={styles.container}>
        <View
          style={{
            paddingTop: getStatusBarHeight() + 10,
            width: '100%',
            backgroundColor: config.Constant.COLOR_PRIMARY,
          }}
        />
        <Text style={styles.itemHeaderTxt}>{'Beasa'}</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{width: '100%', flex: 1, backgroundColor: 'white'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.props.navigation.closeDrawer();
              this.props.props.navigation.navigate('Profile');
            }}
            activeOpacity={0.6}
            style={[styles.itemContainer]}>
            <Text style={styles.itemTxt}>{'Profile'}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              this.props.props.navigation.closeDrawer();
              this.props.props.navigation.navigate('UploadImg');
            }}
            activeOpacity={0.6}
            style={[styles.itemContainer]}>
            <Text style={styles.itemTxt}>{'Upload Event Images'}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Logout', `Are you sure you want logout`, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  onPress: async () => {
                    try {
                      await AsyncStorage.removeItem('uId');
                    } catch (error) {}
                    this.props.props.navigation.dispatch(
                      StackActions.replace('Login'),
                    );
                  },
                },
              ]);
            }}
            activeOpacity={0.6}
            style={[styles.itemContainer]}>
            <Text style={styles.itemTxt}>{'Logout'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Config.Constant.COLOR_WHITE,
    alignItems: 'center',
    paddingTop: 0,
  },
  itemContainer: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: config.Constant.COLOR_BORDER,
  },
  itemTxt: {
    color: config.Constant.COLOR_BLACK,
    fontSize: 15,
  },
  innerIcon: {
    width: config.Constant.SCREEN_WIDTH * 0.08,
    height: config.Constant.SCREEN_WIDTH * 0.08,
    marginRight: 10,
    tintColor: config.Constant.COLOR_PRIMARY,
  },

  itemBottomTxt: {
    color: config.Constant.COLOR_BLACK,
    fontSize: 14,
    width: '90%',
    textAlign: 'left',
    alignSelf: 'center',
    marginBottom: 10,
  },
  itemHeaderTxt: {
    color: 'white',
    backgroundColor: config.Constant.COLOR_PRIMARY,
    fontSize: 19,
    width: '100%',
    textAlign: 'center',
    alignSelf: 'center',
    padding: 10,
  },
});
