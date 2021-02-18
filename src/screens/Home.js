import React from 'react';
import {StyleSheet,
  Text,
  StatusBar,
  Image,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,} from 'react-native';
import config from '../config';
import Header from '../component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modules from '../modules';
import {AddLog, EndLog, UploadData} from '../Util/Utilities';
import ZoomUs from 'react-native-zoom-us';
import CustButton from '../component/CustButton';
import ActionSheet from 'react-native-actionsheet';
import ImageCropPicker from 'react-native-image-crop-picker';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickcount: 0,
      preMackupImg: '',
      mackupImg: '',
      postMackup: '',
      duringMackup: '',
      preMackupImgChange: false,
      mackupImgChange: false,
      postMackupChange: false,
      duringMackupChange: false,
    };
  }
  componentWillMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      this.setState({
        clickcount: 0,
      });
      await this.getData();
    });
    Alert.alert(
      'Beasa International : ',
      'Poster creation for free please create your poster.',
    );

    this.props.navigation.addListener('blur', () => {
      console.log('Stop Strame');
      EndLog();
    });
    AppState.addEventListener('change', this._handleAppStateChange);

    //this.getUrl();
    AppState.removeEventListener('change', this._handleAppStateChange);
  };
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
    } else {
      try {
        EndLog();
      } catch (error) {}
    }
    this.setState({appState: nextAppState});
  };
  getMeetingId = async () => {
    const formData = new FormData();

    formData.append('uId', config.Constant.USER_DATA.uId);

    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.MEETING_ID,
      formData,
    );
    debugger;
    config.Constant.showLoader.hideLoader();
    if (!!data && !!data.Name && !data.Meeting_ID) {
      modules.DropDownAlert.showAlert('info', '', data.Name);
    } else if (!!data) {
      await ZoomUs.initialize(
        {
          clientKey: 'JfsdG0at3p1Z58sOTp4iHiSdrIHOGH36CLuG',
          clientSecret: 'YHxsgpEzVgwYyW1HlBNfTwaEdpoQHUCqi8l4',
        },
        {
          disableShowVideoPreviewWhenJoinMeeting: true,
        },
      );
      AddLog();

      await ZoomUs.joinMeeting({
        userName: data.Name,
        meetingNumber: data.Meeting_ID,
        password: data.Password,
        participantID: config.Constant.USER_DATA.uId,

        // userId: config.Constant.USER_DATA.uId,
        // zoomAccessToken: 'zak',
        // userType: 2, // optional
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Something went wrong please try again',
      );
    }
  };
  verifyPreMackup = async () => {
    if (!this.state.preMackupImgChange) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the pre mackup image',
      );
    } else {
      const formData = new FormData();
      formData.append('uId', config.Constant.USER_DATA.uId);
      formData.append('Image', {
        uri: this.state.preMackupImg,
        name: 'photo.png',
        filename: 'imageName.png',
        type: 'image/png',
      });

      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.PRE_MAKEUP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'Image upload successfully',
        );
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Something went wrong please try again',
        );
      }
    }
  };
  verifyMackup = async () => {
    if (!this.state.mackupImgChange) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the mackup kit image',
      );
    } else {
      const formData = new FormData();
      formData.append('uId', config.Constant.USER_DATA.uId);
      formData.append('Image', {
        uri: this.state.mackupImg,
        name: 'photo.png',
        filename: 'imageName.png',
        type: 'image/png',
      });

      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.MAKEUP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'Image upload successfully',
        );
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Something went wrong please try again',
        );
      }
    }
  };
  verifyPostMackup = async () => {
    if (!this.state.postMackupChange) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the mackup kit image',
      );
    } else {
      const formData = new FormData();
      formData.append('uId', config.Constant.USER_DATA.uId);
      formData.append('Image', {
        uri: this.state.postMackup,
        name: 'photo.png',
        filename: 'imageName.png',
        type: 'image/png',
      });

      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.POST_MAKEUP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'Image upload successfully',
        );
        UploadData(false);
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Something went wrong please try again',
        );
      }
    }
  };
  verifyDuringMackup = async () => {
    if (!this.state.duringMackupChange) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the mackup kit image',
      );
    } else {
      const formData = new FormData();
      formData.append('uId', config.Constant.USER_DATA.uId);
      formData.append('Image', {
        uri: this.state.duringMackup,
        name: 'photo.png',
        filename: 'imageName.png',
        type: 'image/png',
      });

      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.DURING_MAKEUP,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          'Success',
          'Image upload successfully',
        );
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          'Something went wrong please try again',
        );
      }
    }
  };
  onActionSheetOptionPick = (index) => {
    switch (index) {
      case 0:
        ImageCropPicker.openCamera({
          freeStyleCropEnabled: true,
          cropping: true,
          mediaType: 'photo',
        }).then((image) => {
          if (this.selected == 1) {
            this.setState({preMackupImg: image.path, preMackupImgChange: true});
          } else if (this.selected == 2) {
            this.setState({mackupImg: image.path, mackupImgChange: true});
          } else if (this.selected == 3) {
            this.setState({postMackup: image.path, postMackupChange: true});
          } else if (this.selected == 4) {
            this.setState({duringMackup: image.path, duringMackupChange: true});
          }
        });
        break;

      case 1:
        ImageCropPicker.openPicker({
          cropping: true,
          freeStyleCropEnabled: true,
          mediaType: 'photo',
        }).then((image) => {
          if (this.selected == 1) {
            this.setState({preMackupImg: image.path, preMackupImgChange: true});
          } else if (this.selected == 2) {
            this.setState({mackupImg: image.path, mackupImgChange: true});
          } else if (this.selected == 3) {
            this.setState({postMackup: image.path, postMackupChange: true});
          } else if (this.selected == 4) {
            this.setState({duringMackup: image.path, duringMackupChange: true});
          }
        });
        break;

      default:
        break;
    }
  };
  selected = 0;
  GetliveUser = async () => {
    const formData = new FormData();

    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.LIVE_USER,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data && data.status && data.status == 'Success') {
      this.setState({
        liveUser: data.count,
        myTxt: !!data.text ? data.text : '',
      });
    } else {
    }
  };
  getData = async () => {
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!!uId) {
      const formData = new FormData();
      formData.append('uId', uId);
      //config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.VIEW_PROFILE,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        config.Constant.USER_DATA = !!data && !!data.Mobile ? data : null;
        debugger;
        if (!!config.Constant.USER_DATA) {
          config.Constant.USER_DATA.uId = uId;
        }
        if (!data || !data.Name) {
          this.props.navigation.navigate('Profile');
        } else {
          const formData1 = new FormData();
          formData1.append('uId', uId);
          //config.Constant.showLoader.showLoader();
          var data1 = await modules.APIServices.PostApiCall(
            config.ApiEndpoint.UserStatus,
            formData1,
          );
          config.Constant.showLoader.hideLoader();
          if (!!data1 && data1.length > 0) {
          } else {
            this.props.navigation.navigate('Registration');
          }
        }
      }
    }
  };
  render() {
    const {searchTxt} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <Header
          onPressLeft={() => {
            this.props.navigation.openDrawer();
          }}
          Navigation={this.props.navigation}
          isMenu={true}
          title={'Beasa'}
        />
        <ScrollView
        contentContainerStyle={{alignItems: 'center', width: '100%'}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.imagesTitle,{fontSize:22}]}>
          Hello{' '}
          {!!config.Constant.USER_DATA &&
            !!config.Constant.USER_DATA.Name &&
            config.Constant.USER_DATA.Name}
        </Text>
        {/* <Image
          style={{
            width: config.Constant.SCREEN_WIDTH / 2,
            height: config.Constant.SCREEN_WIDTH / 2,
            alignSelf: 'center',
            marginTop: 30,
          }}
          resizeMode={'contain'}
          //source={require('../assets/images/imgpsh_fullsize_anim.png')}
        /> */}
          {/* <Text style={[styles.fontStyleTitle, {textAlign: 'center'}]}>
            {this.state.myTxt}
          </Text> */}
          <Text style={styles.imagesTitle}>Pre Makeup Image</Text>
          <TouchableOpacity
            onPress={() => {
              this.selected = 1;
              this.ActionSheet.show();
            }}>
            <Image
              source={
                !!this.state.preMackupImg
                  ? {uri: this.state.preMackupImg}
                  : require('../assets/images/addImg.png')
              }
              resizeMode={'contain'}
              style={{
                width: config.Constant.SCREEN_WIDTH * 0.4,
                height: config.Constant.SCREEN_WIDTH * 0.4,
              }}
            />
          </TouchableOpacity>
          <CustButton
            onPress={() => {
              this.verifyPreMackup();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              marginTop: 20,
              width: config.Constant.SCREEN_WIDTH * 0.8,
            }}
            btnTxt={'Upload Image'}
          />
          <CustButton
            onPress={() => {
              this.getMeetingId();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              width: config.Constant.SCREEN_WIDTH * 0.8,
              marginTop:15,
              height: 40,
              alignSelf: 'center',
            }}
            btnTxt={'Join Video Hangout'}
          />
          {/* <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              width: '100%',
            }}>
            <Image
              resizeMode={'contain'}
              style={{width: 100, height: 100, marginHorizontal: 0}}
              //source={require('../assets/images/svg_eye.gif')}
            />
            <Text style={styles.fontStyleTitle}>{this.state.liveUser}</Text>
          </View> */}
           <Text style={styles.imagesTitle}>Post Makeup Image</Text>
          <TouchableOpacity
            onPress={() => {
              this.selected = 3;

              this.ActionSheet.show();
            }}>
            <Image
              source={
                !!this.state.postMackup
                  ? {uri: this.state.postMackup}
                  : require('../assets/images/addImg.png')
              }
              resizeMode={'contain'}
              style={{
                width: config.Constant.SCREEN_WIDTH * 0.4,
                height: config.Constant.SCREEN_WIDTH * 0.4,
              }}
            />
          </TouchableOpacity>
          <CustButton
            onPress={() => {
              this.verifyPostMackup();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              marginTop: 20,
              marginBottom: 20,
              width: config.Constant.SCREEN_WIDTH * 0.8,
            }}
            btnTxt={'Upload Image'}
          />
          <CustButton
            onPress={() => {
              UploadData(true);
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              width: config.Constant.SCREEN_WIDTH * 0.8,
              height: 40,
              marginBottom:20,
              alignSelf: 'center',
            }}
            btnTxt={'Submit Records'}
          />
        </ScrollView>
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={'Select option?'}
          options={['Select From Camera', 'Select From Gallery', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => this.onActionSheetOptionPick(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowView: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
  },
  iconView: {
    width: config.Constant.SCREEN_WIDTH * 0.4,
    height: config.Constant.SCREEN_WIDTH * 0.4,
  },
  fontStyleTitle: {
    fontSize: 18,
    marginVertical: 20,
    color: '#d90076',
    fontWeight: '700',
    alignSelf: 'center',
  },
  imagesTitle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    width: config.Constant.SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
});
