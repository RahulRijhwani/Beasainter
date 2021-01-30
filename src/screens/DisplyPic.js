import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import CustSearch from '../component/CustSearch';
import FastImage from 'react-native-fast-image';
import CustButton from '../component/CustButton';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import modules from '../modules';
import Share from 'react-native-share';
import {getValid, getValidMessage} from '../Util/Utilities';
import moment from 'moment';

export default class DisplyPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UpdatedImage: null,
      UpdatedImageData: null,
      original: false,
      onLoadImage: true,
    };
  }
  componentWillMount = () => {
    this.props.navigation.addListener('focus', () => {
      if (!config.Constant.USER_DATA || !config.Constant.USER_DATA.Name) {
        //this.props.navigation.pop();
        //modules.DropDownAlert.showAlert('error', '', 'Please setup your company profile first for poster');
        //return;
      }
      var logoPath = [];
      var is_logo = false;
      var UpdatedImage = this.props.route.params.UpdatedImage;
      this.setState({
        UpdatedImage
      })
      
    });
  };
  
  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  shareImage = async (uri) => {
    var option = {
      url: uri,
      title: 'Share Poster',
      message: 'I got this creative from QuickyFly',
      type: 'image/png',
    };
    config.Constant.showLoader.hideLoader();
    Share.open(option);
    //this.props.navigation.navigate('Home');
  };
  savePicture = async (uri) => {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      modules.DropDownAlert.showAlert(
        'error',
        '',
        'Please check Storage Permission from setting',
      );
      return;
    }
    config.Constant.showLoader.showLoader();
    await CameraRoll.save(uri);
    modules.DropDownAlert.showAlert(
      'success',
      '',
      'Image successfully saved to your gallery...',
    );
    this.shareImage(uri);
  };

  onImageLoad = () => {
    //alert('start');
    this.refs.viewShot.capture().then((uri) => {
      console.log('do something with ', uri);
      //alert(uri);

      this.savePicture(uri);
    });
  };
  render() {
    const {UpdatedImage, original} = this.state;
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
          title={'Saved Poster'}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            {/* <CustSearch containerStyle={{ width: '90%', alignSelf: 'center', marginVertical: 20 }} /> */}
            <ScrollView
              contentContainerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }
              }
              bounces={false}
              horizontal={true}>
              <ViewShot
                ref="viewShot"
                onPress={() => {
                  //this.props.navigation.navigate('Home');
                }}
                style={{
                  marginTop: 40,
                  alignSelf: 'center',
                }}>
                <FastImage
                  style={{
                    width: config.Constant.SCREEN_WIDTH*0.8,
                    height: config.Constant.SCREEN_WIDTH,
                    alignSelf: 'center',
                    zIndex: -10,
                  }}
                  source={
                    !!UpdatedImage
                      ? {uri: UpdatedImage}
                      : require('../assets/images/addImg.png')
                  }
                  resizeMode={FastImage.resizeMode.contain}
                  onLoadStart={(e) => {
                    this.setState({
                      onLoadImage: true,
                    });
                  }}
                  onLoad={(e) => {}}
                  onLoadEnd={(e) => {
                    this.setState({
                      onLoadImage: false,
                    });
                  }}
                />
              </ViewShot>
            </ScrollView>
            <View style={styles.packView}>
              {/* <View style={styles.historyRow}>
								<Text style={styles.titleTxt}>Points</Text>
								<Text style={styles.amountTxt}>
									{!!this.state.UpdatedImageData && !!this.state.UpdatedImageData.Points ? (
										this.state.UpdatedImageData.Points
									) : (
										0
									)}
								</Text>
							</View> */}
              {/* <Text style={styles.decTxt}>
								This image takes{' '}
								{!!this.state.UpdatedImageData && !!this.state.UpdatedImageData.Points ? (
									this.state.UpdatedImageData.Points
								) : (
									0
								)}{' '}
								points from your current balance
							</Text> */}
              <CustButton
                onPress={async () => {
                    this.onImageLoad();
                }}
                containerStyle={{width: '100%'}}
                btnTxt={'Save & Share Image'}
              />
            </View>
          </View>
        </ScrollView>
        {!!this.state.onLoadImage && (
          <View
            style={{
              position: 'absolute',
              width: config.Constant.SCREEN_WIDTH,
              height: config.Constant.SCREEN_HEIGHT,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 600, height: 500}}
              resizeMode={'contain'}
              source={require('../assets/images/loadUI.gif')}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {width: '100%', alignSelf: 'center'},
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  historyRow: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  titleTxt: {
    fontSize: 15,
    flex: 1,
    color: config.Constant.COLOR_PRIMARY,
  },
  floatingStyle: {
    position: 'absolute',
    zIndex: 10,
    width: 50,
    height: 50,
  },
  floatingTxtStyle: {
    position: 'absolute',
    zIndex: 12,
  },
  packView: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    //borderWidth: 1,
    borderColor: config.Constant.COLOR_PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 30,
  },
  titleTxt: {
    fontSize: 18,
    flex: 1,
    color: config.Constant.COLOR_PRIMARY,
    fontWeight: '700',
  },
  decTxt: {
    fontSize: 15,
    textAlign: 'left',
    color: config.Constant.COLOR_PRIMARY,
    width: '100%',
    marginBottom: 10,
  },
  floatTxt: {
    fontSize: 14,
    textAlign: 'left',
    color: config.Constant.COLOR_PRIMARY,
  },
  amountTxt: {
    fontSize: 17,
    color: config.Constant.COLOR_PRIMARY,
    fontWeight: '700',
  },
});
