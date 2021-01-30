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
  Platform,
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
import ImagePicker from 'react-native-image-crop-picker';
var RNFS = require('react-native-fs');

export default class PosterC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UpdatedImage: null,
      UpdatedImageData: null,
      original: false,
      onLoadImage: true,
      imgSrc: '',
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
      var posterId = this.props.route.params.posterId;
      this.getPostData(posterId);
      if (!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.Image) {
        var logoPath = config.Constant.USER_DATA.Image.split('/');
        if (logoPath.length > 0) {
          is_logo = logoPath[logoPath.length - 1].includes('.');
        }
      } else {
        //this.props.navigation.navigate('Profile');
        //modules.DropDownAlert.showAlert('error', '', 'Please setup your company profile first');
      }
      if (!is_logo) {
        //this.props.navigation.navigate('Profile');
        //modules.DropDownAlert.showAlert('error', '', 'Please setup your company profile first');
      } else {
        // var posterId = this.props.route.params.posterId;
        // this.getPostData(posterId);
      }
      // this.setState({
      // 	UpdatedImage: !!config.Constant.selectedImage ? config.Constant.selectedImage : null
      // });
      config.Constant.selectedImage = null;
      this.getImagePicker();
    });
  };
  getImagePicker = () => {
    if (!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.Image) {
      RNFS.downloadFile({
        fromUrl: config.Constant.USER_DATA.Image,
        toFile: `${RNFS.DocumentDirectoryPath}/react-native.png`,
      }).promise.then((r) => {
        ImagePicker.openCropper({
          path: `file://${RNFS.DocumentDirectoryPath}/react-native.png`,
          width: 500,
          height: 500,
        }).then((image) => {
          console.log(image);
          this.setState({
            imgSrc: image.path,
          });
        });
        // this.setState({
        //   imgSrc: `file://${RNFS.DocumentDirectoryPath}/react-native.png`,
        // });
      });
    }
  };
  getPostData = async (posterId) => {
    const formData = new FormData();
    formData.append('posterid', posterId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_POST_DETAILS,
      formData,
    );
    console.log(JSON.stringify(data));
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      debugger;
      this.setState({
        UpdatedImage: !!data.Blank_Image ? data.Blank_Image : null,
        UpdatedImageData: !!data ? data : null,
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Something went wrong please try again',
      );
      this.props.navigation.pop();
    }
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
      message: '',
      type: 'image/png',
    };
    Share.open(option);
    //this.props.navigation.navigate('Home');
  };
  savePicture = async (uri, is_save) => {
    if (!!is_save) {
      if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
        modules.DropDownAlert.showAlert(
          'error',
          '',
          'Please check Storage Permission from setting',
        );
        return;
      } else {
        config.Constant.showLoader.showLoader();
        await CameraRoll.save(uri);

        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'success',
          '',
          'Image successfully saved to your gallery...',
        );
      }
    } else {
      this.shareImage(uri);
    }
  };

  onImageLoad = (is_save) => {
    //alert('start');
    this.refs.viewShot.capture().then((uri) => {
      console.log('do something with ', uri);
      //alert(uri);

      this.savePicture(uri, is_save);
      //this.shareImage(uri);
    });
  };
  getFullWidth = (posterWidth) => {
    if (posterWidth > config.Constant.SCREEN_WIDTH) {
      return config.Constant.SCREEN_WIDTH;
    } else {
      return posterWidth;
    }
  };
  getFullHeight = (posterHeight, posterHeightOriginal, posterWidth) => {
    if (posterWidth == posterHeightOriginal) {
      if (posterWidth > config.Constant.SCREEN_WIDTH) {
        return config.Constant.SCREEN_WIDTH;
      } else {
        return posterWidth;
      }
    } else {
      if (posterHeightOriginal > config.Constant.SCREEN_HEIGHT * 0.7) {
        return config.Constant.SCREEN_HEIGHT * 0.7;
      } else {
        return posterHeightOriginal;
      }
    }
  };
  getFullWidthImage = (posterWidth, posterOriginalWidth) => {
    debugger;
    if (posterOriginalWidth > config.Constant.SCREEN_WIDTH) {
      var per = (posterWidth * 100) / posterOriginalWidth;
      var finalWidth = (per * config.Constant.SCREEN_WIDTH) / 100;
      return finalWidth;
    } else {
      return posterWidth;
    }
  };
  getFullHeightImage = (posterHeight, posterHeightOriginal, posterWidth) => {
    if (posterWidth == posterHeightOriginal) {
      if (posterHeight > config.Constant.SCREEN_WIDTH) {
        var per = (posterHeight * 100) / posterHeightOriginal;
        var finalHeight = (per * config.Constant.SCREEN_WIDTH) / 100;
        return finalHeight;
      } else {
        return posterHeight;
      }
    } else if (posterHeightOriginal > config.Constant.SCREEN_HEIGHT * 0.7) {
      var per = (posterHeight * 100) / posterHeightOriginal;
      return (per * config.Constant.SCREEN_HEIGHT * 0.7) / 100;
    } else {
      return posterWidth;
    }
    // {
    //   if (posterHeightOriginal > config.Constant.SCREEN_HEIGHT * 0.7) {
    //     return config.Constant.SCREEN_HEIGHT * 0.7;
    //   } else {
    //     return posterHeightOriginal;
    //   }
    // }
  };
  getLogoYTop = (yPosition, posterHeight, posterWidth) => {
    if (posterWidth == posterHeight) {
      if (posterWidth > config.Constant.SCREEN_WIDTH) {
        var per = config.Constant.SCREEN_WIDTH * 100;
        var perPerfect = per / posterWidth;
        var yPer = (perPerfect * yPosition) / 100;
        return yPer;
      } else {
        return yPosition;
      }
    } else {
      if (posterHeight > config.Constant.SCREEN_HEIGHT * 0.7) {
        var per = config.Constant.SCREEN_HEIGHT * 0.7 * 100;
        var perPerfect = per / posterHeight;
        var yPer = (perPerfect * yPosition) / 100;
        return yPer;
      } else {
        return yPosition;
      }
    }
  };
  getLogoXLeft = (xPosition, posterWidth) => {
    //debugger;
    if (posterWidth > config.Constant.SCREEN_WIDTH) {
      var per = config.Constant.SCREEN_WIDTH * 100;
      var perPerfect = per / posterWidth;
      var xPer = (perPerfect * xPosition) / 100;
      return xPer + 2;
    } else {
      return xPosition;
    }
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
          title={'Poster Creation'}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            {/* <CustSearch containerStyle={{ width: '90%', alignSelf: 'center', marginVertical: 20 }} /> */}
            <ScrollView
              contentContainerStyle={
                !!this.state.UpdatedImageData &&
                parseInt(this.state.UpdatedImageData.Width) >
                  config.Constant.SCREEN_WIDTH
                  ? {alignItems: 'center', justifyContent: 'center'}
                  : {
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
                    width: original
                      ? !!this.state.UpdatedImageData &&
                        parseInt(this.state.UpdatedImageData.Width)
                        ? parseInt(this.state.UpdatedImageData.Width)
                        : config.Constant.SCREEN_WIDTH
                      : this.getFullWidth(
                          !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Width)
                            ? parseInt(this.state.UpdatedImageData.Width)
                            : config.Constant.SCREEN_WIDTH,
                        ),
                    height: original
                      ? !!this.state.UpdatedImageData &&
                        parseInt(this.state.UpdatedImageData.Height)
                        ? parseInt(this.state.UpdatedImageData.Height)
                        : 200
                      : this.getFullHeight(
                          !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Height)
                            ? parseInt(this.state.UpdatedImageData.Height)
                            : 200,
                          !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Height)
                            ? parseInt(this.state.UpdatedImageData.Height)
                            : config.Constant.SCREEN_HEIGHT,
                          !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Width)
                            ? parseInt(this.state.UpdatedImageData.Width)
                            : config.Constant.SCREEN_WIDTH,
                        ),
                    alignSelf: 'center',
                    zIndex: -10,
                  }}
                  source={
                    !!UpdatedImage
                      ? {uri: UpdatedImage}
                      : require('../assets/images/addImg.png')
                  }
                  resizeMode={'contain'}
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
                {/* PROFILE IMAGE */}
                {!!this.state.imgSrc && (
                  <FastImage
                    style={[
                      styles.floatingStyle,
                      {
                        width: original
                          ? config.Constant.SCREEN_WIDTH * 0.2
                          : !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Image_Width)
                          ? this.getFullWidthImage(
                              !!this.state.UpdatedImageData &&
                                parseInt(
                                  this.state.UpdatedImageData.Image_Width,
                                )
                                ? parseInt(
                                    this.state.UpdatedImageData.Image_Width,
                                  )
                                : 10,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Width)
                                ? parseInt(this.state.UpdatedImageData.Width)
                                : 50,
                            )
                          : 50,
                        height: original
                          ? config.Constant.SCREEN_WIDTH * 0.2
                          : !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Height)
                          ? this.getFullHeightImage(
                              !!this.state.UpdatedImageData &&
                                parseInt(
                                  this.state.UpdatedImageData.Image_Height,
                                )
                                ? parseInt(
                                    this.state.UpdatedImageData.Image_Height,
                                  )
                                : 10,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Height)
                                ? parseInt(this.state.UpdatedImageData.Height)
                                : 50,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Width)
                                ? parseInt(this.state.UpdatedImageData.Width)
                                : 50,
                            )
                          : 50,

                        top: original
                          ? !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Image_Y_pos)
                            ? parseInt(this.state.UpdatedImageData.Image_Y_pos)
                            : 10
                          : this.getLogoYTop(
                              !!this.state.UpdatedImageData &&
                                parseInt(
                                  this.state.UpdatedImageData.Image_Y_pos,
                                )
                                ? parseInt(
                                    this.state.UpdatedImageData.Image_Y_pos,
                                  )
                                : 10,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Height)
                                ? parseInt(this.state.UpdatedImageData.Height)
                                : 50,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Width)
                                ? parseInt(this.state.UpdatedImageData.Width)
                                : 50,
                            ),
                        left: original
                          ? !!this.state.UpdatedImageData &&
                            parseInt(this.state.UpdatedImageData.Image_X_pos)
                            ? parseInt(this.state.UpdatedImageData.Image_X_pos)
                            : 10
                          : this.getLogoXLeft(
                              !!this.state.UpdatedImageData &&
                                parseInt(
                                  this.state.UpdatedImageData.Image_X_pos,
                                )
                                ? parseInt(
                                    this.state.UpdatedImageData.Image_X_pos,
                                  )
                                : 10,
                              !!this.state.UpdatedImageData &&
                                parseInt(this.state.UpdatedImageData.Width)
                                ? parseInt(this.state.UpdatedImageData.Width)
                                : 50,
                            ),
                      },
                    ]}
                    source={
                      !!this.state.imgSrc
                        ? {uri: this.state.imgSrc}
                        : require('../assets/images/addImg.png')
                    }
                    resizeMode={'contain'}
                  />
                )}

                {/* World record logo */}
                <FastImage
                  style={[
                    styles.floatingStyle,
                    {
                      zIndex: 10,
                      width: original
                        ? config.Constant.SCREEN_WIDTH * 0.2
                        : !!this.state.UpdatedImageData &&
                          parseInt(this.state.UpdatedImageData.WR_Size)
                        ? this.getFullWidthImage(
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.WR_Size)
                              ? parseInt(this.state.UpdatedImageData.WR_Size)
                              : 10,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                              ? parseInt(this.state.UpdatedImageData.Width)
                              : 50,
                          )
                        : 50,
                      height: original
                        ? config.Constant.SCREEN_WIDTH * 0.2
                        : !!this.state.UpdatedImageData &&
                          parseInt(this.state.UpdatedImageData.Height)
                        ? this.getFullHeightImage(
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.WR_Size)
                              ? parseInt(this.state.UpdatedImageData.WR_Size)
                              : 10,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Height)
                              ? parseInt(this.state.UpdatedImageData.Height)
                              : 50,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                              ? parseInt(this.state.UpdatedImageData.Width)
                              : 50,
                          )
                        : 50,

                      top: original
                        ? !!this.state.UpdatedImageData &&
                          parseInt(this.state.UpdatedImageData.WR_Y_pos)
                          ? parseInt(this.state.UpdatedImageData.WR_Y_pos)
                          : 10
                        : this.getLogoYTop(
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.WR_Y_pos)
                              ? parseInt(this.state.UpdatedImageData.WR_Y_pos)
                              : 10,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Height)
                              ? parseInt(this.state.UpdatedImageData.Height)
                              : 50,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                              ? parseInt(this.state.UpdatedImageData.Width)
                              : 50,
                          ),
                      left: original
                        ? !!this.state.UpdatedImageData &&
                          parseInt(this.state.UpdatedImageData.WR_X_pos)
                          ? parseInt(this.state.UpdatedImageData.WR_X_pos)
                          : 10
                        : this.getLogoXLeft(
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.WR_X_pos)
                              ? parseInt(this.state.UpdatedImageData.WR_X_pos)
                              : 10,
                            !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                              ? parseInt(this.state.UpdatedImageData.Width)
                              : 50,
                          ),
                    },
                  ]}
                  source={require('../assets/images/world_record.png')}
                  resizeMode={'contain'}
                />
                {!!config.Constant.USER_DATA &&
                  !!config.Constant.USER_DATA.Name && (
                    <View
                      style={[
                        styles.floatingTxtStyle,
                        {
                          top: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Name_Y_pos)
                              ? parseInt(this.state.UpdatedImageData.Name_Y_pos)
                              : 10
                            : this.getLogoYTop(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Name_Y_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Name_Y_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Height)
                                  ? parseInt(this.state.UpdatedImageData.Height)
                                  : 50,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                          left: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Name_X_pos)
                              ? parseInt(this.state.UpdatedImageData.Name_X_pos)
                              : 10
                            : this.getLogoXLeft(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Name_X_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Name_X_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                          width: original
                            ? config.Constant.SCREEN_WIDTH * 0.2
                            : !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Image_Width)
                            ? this.getFullWidthImage(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Image_Width,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Image_Width,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              )
                            : 50,
                          alignContent: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.floatTxt,
                          {
                            fontSize:
                              !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                                ? config.Constant.SCREEN_WIDTH * 0.033
                                : 15,
                            marginTop: 0,
                            color:
                              !!this.state.UpdatedImageData &&
                              !!this.state.UpdatedImageData.Color
                                ? this.state.UpdatedImageData.Color
                                : config.Constant.COLOR_PRIMARY,
                          },
                        ]}>
                        {config.Constant.USER_DATA.Name}
                        {'\n'}
                        {config.Constant.USER_DATA.Saloon_Name}
                        {'\n'}
                        {config.Constant.USER_DATA.Mobile}
                      </Text>
                    </View>
                  )}
                {!!config.Constant.USER_DATA &&
                  false &&
                  !!config.Constant.USER_DATA.Saloon_Name && (
                    <View
                      style={[
                        styles.floatingTxtStyle,
                        {
                          top: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Salon_Y_pos)
                              ? parseInt(
                                  this.state.UpdatedImageData.Salon_Y_pos,
                                )
                              : 10
                            : this.getLogoYTop(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Salon_Y_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Salon_Y_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Height)
                                  ? parseInt(this.state.UpdatedImageData.Height)
                                  : 50,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                          left: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Salon_X_pos)
                              ? parseInt(
                                  this.state.UpdatedImageData.Salon_X_pos,
                                )
                              : 10
                            : this.getLogoXLeft(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Salon_X_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Salon_X_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                        },
                      ]}>
                      <Text
                        style={[
                          styles.floatTxt,
                          {
                            fontSize:
                              !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                                ? config.Constant.SCREEN_WIDTH * 0.033
                                : 15,
                            marginTop: -2,
                            color:
                              !!this.state.UpdatedImageData &&
                              !!this.state.UpdatedImageData.Color
                                ? this.state.UpdatedImageData.Color
                                : config.Constant.COLOR_PRIMARY,
                          },
                        ]}>
                        {config.Constant.USER_DATA.Saloon_Name}
                      </Text>
                    </View>
                  )}
                {!!config.Constant.USER_DATA &&
                  false &&
                  !!config.Constant.USER_DATA.Mobile && (
                    <View
                      style={[
                        styles.floatingTxtStyle,
                        {
                          top: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(
                                this.state.UpdatedImageData.Contact_Y_pos,
                              )
                              ? parseInt(
                                  this.state.UpdatedImageData.Contact_Y_pos,
                                )
                              : 10
                            : this.getLogoYTop(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Contact_Y_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Contact_Y_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Height)
                                  ? parseInt(this.state.UpdatedImageData.Height)
                                  : 50,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                          left: original
                            ? !!this.state.UpdatedImageData &&
                              parseInt(
                                this.state.UpdatedImageData.Contact_X_pos,
                              )
                              ? parseInt(
                                  this.state.UpdatedImageData.Contact_X_pos,
                                )
                              : 10
                            : this.getLogoXLeft(
                                !!this.state.UpdatedImageData &&
                                  parseInt(
                                    this.state.UpdatedImageData.Contact_X_pos,
                                  )
                                  ? parseInt(
                                      this.state.UpdatedImageData.Contact_X_pos,
                                    )
                                  : 10,
                                !!this.state.UpdatedImageData &&
                                  parseInt(this.state.UpdatedImageData.Width)
                                  ? parseInt(this.state.UpdatedImageData.Width)
                                  : 50,
                              ),
                        },
                      ]}>
                      <Text
                        style={[
                          styles.floatTxt,
                          {
                            fontSize:
                              !!this.state.UpdatedImageData &&
                              parseInt(this.state.UpdatedImageData.Width)
                                ? config.Constant.SCREEN_WIDTH * 0.033
                                : 15,
                            marginTop: -2,
                            color:
                              !!this.state.UpdatedImageData &&
                              !!this.state.UpdatedImageData.Color
                                ? this.state.UpdatedImageData.Color
                                : config.Constant.COLOR_PRIMARY,
                          },
                        ]}>
                        {config.Constant.USER_DATA.Mobile}
                      </Text>
                    </View>
                  )}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 50,
                }}>
                <CustButton
                  onPress={async () => {
                    this.onImageLoad(true);
                  }}
                  containerStyle={{width: '48%'}}
                  btnTxt={'Save Image'}
                />
                <CustButton
                  onPress={async () => {
                    this.onImageLoad(false);
                  }}
                  containerStyle={{width: '48%'}}
                  btnTxt={'Share Image'}
                />
              </View>
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
              style={{width: 60, height: 60}}
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
    zIndex: -11,
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
    color: config.Constant.COLOR_PRIMARY,
    fontFamily: 'Lato-Black',
    textAlign: 'center',
    fontWeight: '700',
  },
  amountTxt: {
    fontSize: 17,
    color: config.Constant.COLOR_PRIMARY,
    fontWeight: '700',
  },
});
