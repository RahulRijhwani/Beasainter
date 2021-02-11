import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  AppState,
  Image,
  View,
  Text,
} from 'react-native';
import CustInput from '../component/CustInput';
import CustButton from '../component/CustButton';
import config from '../config';
import modules from '../modules';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';
import {StackActions} from '@react-navigation/native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '',
      fcmData: '',
    };
    //config.Constant.showLoader.showLoader();
  }

  verify = async () => {
    //config.Constant.showLoader.showLoader();
    if (!this.state.num || this.state.num.length != 10) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please fill correct phone number',
      );
      try {
        // await AsyncStorage.setItem('uId', '100');

        // this.props.navigation.reset({
        //   index: 1,
        //   routes: [{name: 'DrawerNavigator'}],
        // });
      } catch (error) {}
    } else {
      var otpHash = await RNOtpVerify.getHash();
      const formData = new FormData();
      formData.append('mobile', this.state.num);
      try {
        formData.append('hashkey', otpHash[0]);
      } catch (error) {}

      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.SEND_OTP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'Otp number sent to your mobile number',
        );
        config.Constant.USER_DATA = {mobile_num: this.state.num};
        this.props.navigation.navigate('OtpScreen');
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Something went wrong please try again',
        );
      }
    }
  };
  render() {
    const {num} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <View style={{width: '80%', alignSelf: 'center'}}>
          <Image
            style={{
              width: config.Constant.SCREEN_WIDTH / 2,
              height: config.Constant.SCREEN_WIDTH / 2,
              alignSelf: 'center',
              marginBottom: 60,
            }}
            resizeMode={'contain'}
            source={require('../assets/images/imgpsh_fullsize_anim.png')}
          />
          <CustInput
            value={num}
            keyboardType={'numeric'}
            textContainerStyle={config.Constant.COLOR_PRIMARY}
            title={'Login With Mobile Number'}
            onChangeText={(num) => {
              this.setState({
                num,
              });
            }}
          />

          <CustButton
            onPress={() => {
              this.verify();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{marginTop: 20}}
            btnTxt={'Get OTP'}
          />
          {/* <CustButton
						onPress={() => {
							this.props.navigation.navigate('Signup');
						}}
						containerStyle={{ marginTop: 20 }}
						btnTxt={'Sign up'}
					/> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
