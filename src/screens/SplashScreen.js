import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  AppState,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export default class SplashScreen extends React.Component {
  state = {
    appUpdateView: false,
  };

  componentDidMount = async () => {
    //this.getFcm();
    //this.props.navigation.replace('Login')
    this.checkFCMPermission()
    setTimeout(async () => {
      try {
        var uId = await AsyncStorage.getItem('uId');
        if (!!uId) {
          //alert(uId)
          this.props.navigation.replace('DrawerNavigator');
        } else {
          this.props.navigation.replace('Login');
        }
      } catch (error) {}
    }, 1000);
  };
  getDeviceToken = async () => {
    await messaging()
      .getToken()
      .then((fcmTkn) => {
        console.log('FCM DEVICE = ' + fcmTkn);
        config.Constant.FCM_TOKEN = fcmTkn;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  checkFCMPermission = async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getDeviceToken();
    } else {
      this.requestPermission();
    }
  };
  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      this.getDeviceToken();
    } catch (error) {}
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <Image
          style={{
            width: config.Constant.SCREEN_WIDTH / 2.3,
            height: config.Constant.SCREEN_WIDTH / 2.3,
          }}
          resizeMode={'contain'}
          source={require('../assets/images/imgpsh_fullsize_anim.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
