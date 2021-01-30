import React from 'react';
import {
  StyleSheet,
  Text,
  StatusBar,
  AppState,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import CustInput from '../component/CustInput';
import CustButton from '../component/CustButton';
import CodeInput from 'react-native-code-input';
import config from '../config';
//import firebaseService from '../config/firebaseService';
import RNOtpVerify from 'react-native-otp-verify';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OtpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '',
      timer: '00:60',
      isResend: false,
      otpCode: '',
      fcmData: '',
    };

    //this.getFcm();
  }
  getFcm = async () => {
    await firebaseService
      .messaging()
      .getToken()
      .then((fcmTkn) => {
        console.log('getFcm = ' + fcmTkn);
        this.setState({
          fcmData: fcmTkn,
        });
      })
      .catch((err) => {
        console.log('getFcm' + err);
      });
  };
  componentDidMount = async () => {
    var timer = 60;
    this.interval = setInterval(() => {
      timer--;
      this.setState({
        timer: `00:${timer < 10 ? '0' + timer : timer}`,
      });
      if (timer < 1) {
        clearInterval(this.interval);
        this.setState({
          isResend: true,
        });
      }
    }, 1000);
    this.startListeningForOtp();
  };

  startListeningForOtp = () =>
    RNOtpVerify.getOtp()
      .then((p) => RNOtpVerify.addListener(this.otpHandler))
      .catch((p) => console.log(p));

  otpHandler = (message) => {
    console.log('message = ' + message);
    const otp = message.split(' ');
    var otpCode = otp[otp.length - 1];
    otpCode = otpCode.replace('.', '');
    if (typeof parseInt(otpCode) == 'number') {
      this.setState({otpCode}, () => {
        this.verify();
      });
    }

    RNOtpVerify.removeListener();
  };
  componentWillUnmount = () => {
    RNOtpVerify.removeListener();
  };
  verify = async () => {
    if (!this.state.otpCode || this.state.otpCode.length != 6) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please fill six digit OTP',
      );
    } else {
      const formData = new FormData();
      formData.append('mobile', config.Constant.USER_DATA.mobile_num);
      formData.append('otp', this.state.otpCode);
      if (!!this.state.fcmData) {
        formData.append('fireid', this.state.fcmData);
      }
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.VERIFY_OTP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'OTP number verified successfully',
        );
        try {
          await AsyncStorage.setItem('uId', data.uId);
        } catch (error) {}
        this.setState({
          otpCode: '',
        });
        this.props.navigation.reset({
          index: 1,
          routes: [{name: 'DrawerNavigator'}],
        });
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Entered OTP is incorrect',
        );
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <View style={{width: '100%', alignSelf: 'center'}}>
          <Image
            style={{
              width: config.Constant.SCREEN_WIDTH / 2,
              height: config.Constant.SCREEN_WIDTH / 2,
              alignSelf: 'center',
              marginBottom: 40,
            }}
            resizeMode={'contain'}
            source={require('../assets/images/imgpsh_fullsize_anim.png')}
          />
          {/* <CodeInput
						ref="codeInputRef1"
						activeColor={config.Constant.COLOR_PRIMARY}
						inactiveColor={config.Constant.COLOR_PRIMARY}
						keyboardType={'numeric'}
						borderType={'underline'}
						space={5}
						codeLength={6}
						size={40}
						inputPosition="center"
						codeInputStyle={{ color: config.Constant.COLOR_PRIMARY, fontSize: 15 }}
						onFulfill={(code) => {
							this.setState({ otpCode: code }, () => {
								this.verify();
							});
						}}
					/> */}
          <CodeField
            value={this.state.otpCode}
            onChangeText={(code) => {
              this.setState({otpCode: code}, () => {
                try {
                  if (code.length > 5) {
                    this.verify();
                  }
                } catch (error) {}
              });
            }}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <Text style={styles.txtStyle}>Resend OTP in {this.state.timer}</Text>
          <CustButton
            onPress={() => {
              //this.props.navigation.navigate('DrawerNavigator');
              this.verify();
            }}
            containerStyle={{marginTop: 10, marginHorizontal: 30}}
            btnTxt={'Verify OTP'}
          />
          {!!this.state.isResend && (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isResend: false,
                });
                var timer = 60;
                this.interval = setInterval(() => {
                  timer--;
                  this.setState({
                    timer: `00:${timer < 10 ? '0' + timer : timer}`,
                  });
                  if (timer < 1) {
                    clearInterval(this.interval);
                    this.setState({
                      isResend: true,
                    });
                  }
                }, 1000);
              }}>
              <Text style={styles.txtResendStyle}>Resend</Text>
            </TouchableOpacity>
          )}
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
  txtStyle: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 30,
    color: config.Constant.COLOR_PRIMARY,
  },
  txtResendStyle: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 10,
    color: config.Constant.COLOR_PRIMARY,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: config.Constant.SCREEN_WIDTH * 0.85,
    alignSelf: 'center',
  },
  cellRoot: {
    width: config.Constant.SCREEN_WIDTH * 0.11,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: config.Constant.COLOR_PRIMARY,
    fontSize: 20,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: config.Constant.COLOR_PRIMARY,
    borderBottomWidth: 2,
  },
});
