import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import CustSearch from '../component/CustSearch';
import modules from '../modules';
import FastImage from 'react-native-fast-image';
import {getValid, getValidMessage} from '../Util/Utilities';
import CameraRoll from '@react-native-community/cameraroll';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

export default class SavedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRow: [],
      catName: '',
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  };
  getData = async () => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_SAVED_POSTER,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      this.setState({
        dataRow: data,
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Something went wrong please try again',
      );
    }
  };
  savePicture1 = async (uri) => {
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      modules.DropDownAlert.showAlert(
        'error',
        '',
        'Please check Storage Permission from setting',
      );
      return;
    }
    await CameraRoll.save(uri);
    config.Constant.showLoader.hideLoader();
    modules.DropDownAlert.showAlert(
      'success',
      '',
      'Image successfully saved to your gallery...',
    );
    this.shareImage(uri);
  };
  savePicture = async (image) => {
    if (Platform.OS === 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
      })
        .fetch('GET', image)
        .then(async (res) => {
          debugger;
          await CameraRoll.save(res.path());
          config.Constant.showLoader.hideLoader();
          modules.DropDownAlert.showAlert(
            'success',
            '',
            'Image successfully saved to your gallery...',
          );
          this.shareImage('file://' + res.path());
        });
    } else {
      CameraRoll.saveToCameraRoll(image.urls.small).then(
        Alert.alert('Success', 'Photo added to camera roll!'),
      );
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
      message: 'I got this creative from QuickyFly',
      type: 'image/png',
    };
    Share.open(option);
    this.props.navigation.navigate('Home');
  };
  renderSubItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderColor: config.Constant.COLOR_PRIMARY,
          borderWidth: 0.5,
          paddingBottom: 5,
          paddingHorizontal: 3,
          marginVertical: 0,
          width: '33.33%',
        }}
        onPress={async () => {
          this.props.navigation.navigate('DisplyPic', {
            UpdatedImage: item.Image,
          });
          //this.savePicture(item.Image)
        }}>
        <FastImage
          style={{width: '100%', height: 90, marginTop: 10}}
          source={{uri: item.Image}}
        />
        {/* <Text
					style={{
						color: config.Constant.COLOR_PRIMARY,
						fontSize: 14,
						marginTop: 10,
						textAlign: 'center'
					}}
				>
					{item.Sub_Category}
				</Text> */}
      </TouchableOpacity>
    );
  };
  renderItem = ({item, index}) => {
    return (
      <View style={{marginVertical: 10, width: '100%'}}>
        <Text
          style={{
            color: config.Constant.COLOR_PRIMARY,
            fontSize: 18,
            margin: 10,
            textAlign: 'left',
          }}>
          {item.Sub_Category}
        </Text>
      </View>
    );
  };
  render() {
    const {num} = this.state;
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
          title={'Downloads'}
        />
        <View style={styles.mainContainer}>
          {/* <TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							borderColor: config.Constant.COLOR_PRIMARY,
							borderWidth: 1,
							paddingHorizontal: 10,
							paddingVertical: 5,
							marginVertical: 20
						}}
					>
						<Image
							resizeMode={'contain'}
							source={require('../assets/images/filter.png')}
							style={{ width: 30, height: 30, marginRight: 10, tintColor: config.Constant.COLOR_PRIMARY }}
						/>
						<Text
							style={{
								color: config.Constant.COLOR_PRIMARY,
								fontSize: 20,
								fontWeight: '600'
							}}
						>
							Short
						</Text>
					</TouchableOpacity> */}
          {/* <FlatList
						extraData={this.state}
						bounces={false}
						renderItem={this.renderItem}
						data={this.state.dataRow}
						showsVerticalScrollIndicator={false}
						style={{ width: '100%', alignSelf: 'center' }}
						ListFooterComponent={() => {
							return <View style={{ width: 50, height: 50 }} />;
						}}
					/> */}
          <FlatList
            extraData={this.state}
            bounces={false}
            renderItem={this.renderSubItem}
            data={this.state.dataRow}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{justifyContent: 'flex-start'}}
            style={{width: '100%', alignSelf: 'center'}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 15,
  },
  mainContainerScroll: {width: '100%', alignSelf: 'center'},
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  historyRow: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: config.Constant.COLOR_PRIMARY,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  titleTxt: {
    fontSize: 15,
    flex: 1,
    color: config.Constant.COLOR_PRIMARY,
  },
  amountTxt: {
    fontSize: 15,
  },
  floatTxtView: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 10,
  },
  floatTxt: {
    fontSize: 15,
    color: 'white',
    padding: 5,
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: config.Constant.COLOR_PRIMARY,
  },
});
