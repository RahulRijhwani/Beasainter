import React from 'react';
import {
  StyleSheet,
  Text,
  StatusBar,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import CustButton from '../component/CustButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {AddLog, EndLog, UploadData} from '../Util/Utilities';

const resourceType = 'url';
export default class UploadImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Link: 'http://quickyfly.supersoftsolutions.com/guidepdf.ashx?Id=2',
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
    //this.getUrl();
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
  render() {
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
            this.props.navigation.pop();
          }}
          containerStyle={{backgroundColor: config.Constant.COLOR_PRIMARYLIGHT}}
          title={'Update Profile'}
          //balance={true}
        />
        <ScrollView
          contentContainerStyle={{alignItems: 'center', width: '100%'}}
          bounces={false}
          showsVerticalScrollIndicator={false}>
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
                width: config.Constant.SCREEN_WIDTH * 0.5,
                height: config.Constant.SCREEN_WIDTH * 0.5,
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
          {/*
          <Text style={styles.imagesTitle}>Makeup Kit Image</Text>
          <TouchableOpacity
            onPress={() => {
              this.selected = 2;
              this.ActionSheet.show();
            }}>
            <Image
              source={
                !!this.state.mackupImg
                  ? {uri: this.state.mackupImg}
                  : require('../assets/images/addImg.png')
              }
              resizeMode={'contain'}
              style={{
                width: config.Constant.SCREEN_WIDTH * 0.5,
                height: config.Constant.SCREEN_WIDTH * 0.5,
              }}
            />
          </TouchableOpacity>
          <CustButton
            onPress={() => {
              this.selected = 3;

              this.verifyMackup();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              marginTop: 20,
              width: config.Constant.SCREEN_WIDTH * 0.8,
            }}
            btnTxt={'Upload Image'}
          />
           <Text style={styles.imagesTitle}>During Makeup Image</Text>
          <TouchableOpacity
            onPress={() => {
              this.selected = 4;
              this.ActionSheet.show();
            }}>
            <Image
              source={
                !!this.state.duringMackup
                  ? {uri: this.state.duringMackup}
                  : require('../assets/images/addImg.png')
              }
              resizeMode={'contain'}
              style={{
                width: config.Constant.SCREEN_WIDTH * 0.5,
                height: config.Constant.SCREEN_WIDTH * 0.5,
              }}
            />
          </TouchableOpacity>
          <CustButton
            onPress={() => {
              this.selected = 3;

              this.verifyDuringMackup();
              //this.props.navigation.navigate('OtpScreen');
            }}
            containerStyle={{
              marginTop: 20,
              width: config.Constant.SCREEN_WIDTH * 0.8,
            }}
            btnTxt={'Upload Image'}
          /> */}
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
                width: config.Constant.SCREEN_WIDTH * 0.5,
                height: config.Constant.SCREEN_WIDTH * 0.5,
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
  imagesTitle: {
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
});
