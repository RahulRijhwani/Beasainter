import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  BackHandler,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import CustSearch from '../component/CustSearch';
import CustButton from '../component/CustButton';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modules from '../modules';
import ImageViewer from 'react-native-image-zoom-viewer';
import CustDropdown from '../component/CustDropdown';
//import FullAddBanner from '../component/FullAddBanner';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_edit: false,
      name: '',
      email: '',
      whatsapp:'',
      cName: '',
      Address_1: '',
      Address_2: '',
      City: '',
      State: '',
      Country: '',
      Website: '',
      Mobile: '',
      imageURL: '',
      modalVisible: false,
      attImg: '',
      aPoint: '0',
      isImageChange: false,
      selectedCity: 0,
      selectedState: 0,
      CityArr: [],
      StateArr: [],
    };
  }
  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);

    this.props.navigation.addListener('focus', () => {
      this.getData(true);

      this.getDataState(true);
    });
  };
  getDataCity = async (sId) => {
    const formData = new FormData();
    formData.append('stateid', sId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GetCity,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      data.map((itm, ind) => {
        data[ind].value = ind + 1;
        data[ind].label = itm.Name;
      });
      this.setState({
        CityArr: data,
      });
    }
  };
  getDataState = async () => {
    const formData = new FormData();
    formData.append('uId', '1');
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GetState,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      data.map((itm, ind) => {
        data[ind].value = itm.stateid;
        data[ind].label = itm.Name;
      });
      this.setState({
        StateArr: data,
      });
    }
  };
  hardwareBackPress = () => {
    if (!!this.state.modalVisible) {
      this.setState({modalVisible: false});
      return true;
    }else if (!config.Constant.USER_DATA || !config.Constant.USER_DATA.Saloon_Name) {
      modules.DropDownAlert.showAlert('error', '', 'Please update the profile first!');
      return true;
    }
    this.props.navigation.pop()
    return true
  };
  getData = async (is_loading) => {
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!!uId) {
      const formData = new FormData();
      formData.append('uId', uId);
      if (!!is_loading) {
        config.Constant.showLoader.showLoader();
      }
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.VIEW_PROFILE,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        var selectCategoryName = '';

        config.Constant.USER_DATA = !!data && !!data.Mobile ? data : null;
        if (!!config.Constant.USER_DATA) {
          config.Constant.USER_DATA.uId = uId;
        }
        var logoPath = [];
        var is_logo = false;
        if (!!data && !!data.Image) {
          logoPath = data.Image.split('/');
          if (logoPath.length > 0) {
            is_logo = logoPath[logoPath.length - 1].includes('.');
          }
        }
        console.log(!!is_logo ? data.Image : '');
        this.setState({
          name: !!data && !!data.Name ? data.Name : '',
          email: !!data && !!data.Email ? data.Email : '',
          whatsapp: !!data && !!data.Whatsapp ? data.Whatsapp : '',
          cName: !!data && !!data.Saloon_Name ? data.Saloon_Name : '',
          Address_1: !!data && !!data.Address_1 ? data.Address_1 : '',
          Address_2: !!data && !!data.Address_2 ? data.Address_2 : '',
          City: !!data && !!data.City ? data.City : '',
          State: !!data && !!data.State ? data.State : '',
          Mobile: !!data && !!data.Mobile ? data.Mobile : '',
          imageURL: !!is_logo ? data.Image : '',
          is_edit: !data || !data.Name,
        });
        this.state.StateArr.map((item, index) => {
          if (item.label == data.State) {
            this.setState({
              selectedState: item.value,
            });
          }
        });
        this.state.CityArr.map((item, index) => {
          if (item.label == data.City) {
            this.setState({
              selectedCity: item.value,
            });
          }
        });
      }
    }
  };
  showImageFull = () => {
    var urls = [{url: !!this.state.imageURL ? this.state.imageURL : ''}];
    return (
      <Modal
        visible={this.state.modalVisible}
        transparent={false}
        onRequestClose={() => this.setState({modalVisible: false})}>
        <ImageViewer
          renderIndicator={() => {
            return null;
          }}
          imageUrls={urls}
          onSwipeDown={() => {
            console.log('onSwipeDown');
            this.setState({modalVisible: false});
          }}
          backgroundColor={'white'}
          enableSwipeDown={true}
          renderHeader={(currentIndex) => {
            return (
              <Header
                onPressLeft={() => {
                  this.setState({modalVisible: false});
                }}
                containerStyle={{
                  paddingTop: Platform.OS == 'ios' ? 5 : 10,
                }}
                title={''}
              />
            );
          }}
        />
      </Modal>
    );
  };
  onActionSheetOptionPick = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          freeStyleCropEnabled: true,
          cropping: true,
          mediaType: 'photo',
        }).then((image) => {
          this.setState({imageURL: image.path, isImageChange: true});
        });
        break;

      case 1:
        ImagePicker.openPicker({
          cropping: true,
          freeStyleCropEnabled: true,
          mediaType: 'photo',
        }).then((image) => {
          this.setState({imageURL: image.path, isImageChange: true});
        });
        break;

      default:
        break;
    }
  };
  onVerify = async () => {
    const {
      name,
      email,
      cName,
      Address_1,
      Address_2,
      City,
      State,
      Country,
      Website,
      Mobile,
      imageURL,
      whatsapp
    } = this.state;
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!name) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter name');
    } else if (!email) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter email');
    }
    else if (!whatsapp) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter whatsapp number');
    }
    else if (!cName) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter salon name');
    } else if (!Address_1) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter address');
    } else if (!this.state.selectedCity) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter city');
    } else if (!this.state.selectedState) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter state');
    } else if (!imageURL) {
      modules.DropDownAlert.showAlert(
        'error',
        '',
        'Please upload profile logo',
      );
    } else if (!!uId) {
      var selectedCityName = '';
      this.state.CityArr.map((item, index) => {
        if (item.value == this.state.selectedCity) {
          selectedCityName = item.label;
        }
      });
      var selectedStateName = '';
      this.state.StateArr.map((item, index) => {
        if (item.value == this.state.selectedState) {
          selectedStateName = item.label;
        }
      });
      const formData = new FormData();
      formData.append('uId', uId);
      formData.append('Name', name);
      formData.append('Email', email);
      formData.append('Whatsapp', whatsapp);
      formData.append('Saloon_Name', cName);
      formData.append('Address_1', Address_1);
      formData.append('Address_2', Address_2);
      formData.append('State', selectedStateName);
      formData.append('City', selectedCityName);
      if (!!this.state.isImageChange) {
        formData.append('Image', {
          uri: this.state.imageURL,
          name: 'photo.png',
          filename: 'imageName.png',
          type: 'image/png',
        });
      }
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.UPDATE_PROFILE,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status == 'Success') {
        modules.DropDownAlert.showAlert(
          'success',
          '',
          'Profile updated successfully',
        );
        this.setState({
          is_edit: false,
        });
        this.getData(false);
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          'Error',
          !!data.status ? data.status : 'Something went wrong',
        );
      }
    }
    return;

    if (!name) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter name');
    } else if (!email) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter valid email');
    } else if (!cName) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter company name');
    } else if (!Address_1) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter address 1');
    } else if (!City) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter city');
    } else if (!State) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter state');
    } else if (!Country) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter country');
    } else if (!Website) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter website');
    } else if (!Mobile) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter mobile');
    } else if (!Mobile) {
      modules.DropDownAlert.showAlert('error', '', 'Please enter mobile');
    } else if (!imageURL) {
      modules.DropDownAlert.showAlert(
        'error',
        '',
        'Please upload profile logo',
      );
    } else {
      var uId = null;
      try {
        uId = await AsyncStorage.getItem('uId');
      } catch (error) {}
      if (!!uId) {
        const formData = new FormData();
        formData.append('uId', uId);
        formData.append('Name', name);
        formData.append('Email', email);
        formData.append('Company', cName);
        formData.append('Address_1', Address_1);
        formData.append('Address_2', Address_2);
        formData.append('City', City);
        formData.append('State', State);
        formData.append('Country', Country);
        formData.append('Website', Website);
        // formData.append('logo', {
        // 	uri: this.state.imageURL,
        // 	name: 'photo.png',
        // 	filename: 'imageName.png',
        // 	type: 'image/png'
        // });
        config.Constant.showLoader.showLoader();
        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.UPDATE_PROFILE,
          formData,
        );
        config.Constant.showLoader.hideLoader();
        if (data.status == 'Success') {
          modules.DropDownAlert.showAlert(
            'success',
            '',
            'Profile updated successfully',
          );
          this.setState({
            is_edit: false,
          });
          debugger;
        } else {
          modules.DropDownAlert.showAlert(
            'error',
            'Error',
            !!data.status ? data.status : 'Something went wrong',
          );
        }
      }
    }
  };
  render() {
    const {
      imageURL,
      is_edit,
      name,
      email,
      cName,
      Address_1,
      Address_2,
      City,
      State,
      aPoint,
      whatsapp,
      Mobile,
    } = this.state;
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
            this.hardwareBackPress()
          }}
          containerStyle={{backgroundColor: config.Constant.COLOR_PRIMARYLIGHT}}
          title={'Update Profile'}
          //balance={true}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            <View style={{flex: 1}}>
              <View style={{backgroundColor: config.Constant.COLOR_PRIMARY}}>
                {!is_edit && (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        is_edit: true,
                      });
                    }}
                    style={styles.floatIcon}>
                    <Image
                      source={require('../assets/images/editProfile.png')}
                      resizeMode={'contain'}
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: config.Constant.COLOR_WHITE,
                      }}
                    />
                    <Text style={styles.editTitle}>Edit</Text>
                  </TouchableOpacity>
                )}
                {!!is_edit && (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        is_edit: true,
                      });
                    }}
                    style={styles.floatTitleView}>
                    <Text style={styles.floatTitle}>
                      Complete Your Profile !
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    if (!is_edit) {
                      this.setState({
                        modalVisible: true,
                      });
                    } else {
                      this.ActionSheet.show();
                    }
                  }}
                  //disabled={!is_edit}
                  style={styles.profileView}>
                  {!!imageURL ? (
                    <FastImage
                      source={{uri: imageURL}}
                      resizeMode={`cover`}
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 200,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../assets/images/shop.png')}
                      resizeMode={`cover`}
                      style={{
                        width: 160,
                        height: 160,
                        tintColor: config.Constant.COLOR_WHITE,
                        borderRadius: 200,
                        backgroundColor: config.Constant.COLOR_PRIMARY,
                      }}
                    />
                  )}
                  {!!is_edit && (
                    <View style={styles.floatPlusView}>
                      <Text style={{fontSize: 30, color: 'white'}}>+</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={[styles.rowContainer, {marginTop: 90}]}>
                {/* <Image
									source={require('../assets/images/home-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Name</Text>
                  <TextInput
                    editable={!!is_edit}
                    value={name}
                    onChangeText={(name) => {
                      this.setState({
                        name,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>
              <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/email-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Email</Text>
                  <TextInput
                    editable={!!is_edit}
                    value={email}
                    onChangeText={(email) => {
                      this.setState({
                        email,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>
              <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/email-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Whatsapp Number</Text>
                  <TextInput
                    editable={!!is_edit}
                    keyboardType={'phone-pad'}
                    value={whatsapp}
                    onChangeText={(whatsapp) => {
                      this.setState({
                        whatsapp,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>
              <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/name-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Salon Name</Text>
                  <TextInput
                    editable={!!is_edit}
                    value={cName}
                    onChangeText={(cName) => {
                      this.setState({
                        cName,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>
              {/* <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/city-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> 
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>City</Text>
                  <TextInput
                    editable={!!is_edit}
                    value={City}
                    onChangeText={(City) => {
                      this.setState({
                        City,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View> */}
              <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/city-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Address</Text>
                  <TextInput
                    editable={!!is_edit}
                    value={Address_1}
                    onChangeText={(Address_1) => {
                      this.setState({
                        Address_1,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>State</Text>
                  <CustDropdown
                    disabled={!is_edit}
                    containerStyle={styles.drop}
                    data={this.state.StateArr}
                    placeholder={'Select State'}
                    Value={this.state.selectedState}
                    onChange={(date) => {
                      !!date && this.getDataCity(date);
                      this.setState({
                        selectedState: date,
                      });
                    }}
                  />
                </View>
              </View>
              <View style={styles.rowInnerContainer}>
                <Text style={styles.inputTitle}>City</Text>
                <CustDropdown
                  disabled={!is_edit}
                  containerStyle={styles.drop}
                  data={this.state.CityArr}
                  placeholder={'Select City'}
                  Value={this.state.selectedCity}
                  onChange={(date) => {
                    this.setState({
                      selectedCity: date,
                    });
                  }}
                />
              </View>
              <View style={styles.rowContainer}>
                {/* <Image
									source={require('../assets/images/number-01.png')}
									resizeMode={`contain`}
									style={styles.innerIcon}
								/> */}
                <View style={styles.rowInnerContainer}>
                  <Text style={styles.inputTitle}>Mobile Number</Text>
                  <TextInput
                    editable={false}
                    value={Mobile}
                    onChangeText={(Mobile) => {
                      this.setState({
                        Mobile,
                      });
                    }}
                    style={styles.inputTxt}
                  />
                </View>
              </View>
            </View>
            {!!is_edit && (
              <CustButton
                onPress={() => {
                  this.onVerify();
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: '70%',
                  alignSelf: 'center',
                }}
                btnTxt={'UPDATE DETAILS'}
              />
            )}
          </View>
        </ScrollView>
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={'Select option?'}
          options={['Select From Camera', 'Select From Gallery', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => this.onActionSheetOptionPick(index)}
        />
        {this.showImageFull()}
        {/* <FullAddBanner adUnitID={config.Constant.adUnitID} /> */}
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
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 2,
    marginBottom: 5,
  },
  rowInnerContainer: {
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-around',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  innerIcon: {
    width: config.Constant.SCREEN_WIDTH * 0.08,
    height: config.Constant.SCREEN_WIDTH * 0.08,
    marginRight: 10,
    tintColor: config.Constant.COLOR_PRIMARY,
  },
  inputTitle: {
    color: config.Constant.COLOR_PRIMARY,
    fontSize: 18,
    marginTop: 5,
    textAlign: 'left',
    //flex: 0.9,
  },
  editTitle: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 18,
    marginLeft: 10,
  },
  floatTitle: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH,
    textAlign: 'center',
  },
  inputTxt: {
    //flex: 1.1,
    fontSize: 16,
    paddingBottom: 5,
    borderColor: config.Constant.COLOR_PRIMARY,
    color: config.Constant.COLOR_PRIMARY,
    borderBottomWidth: 1,
    textAlign: 'left',
    paddingTop: 0,
  },
  profileView: {
    padding: 10,
    borderRadius: 20,
    //borderWidth: 1,
    borderColor: config.Constant.COLOR_PRIMARY,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: -80,
    width: 160,
    flexDirection: 'row',
  },
  floatIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 20,
  },
  floatTitleView: {
    position: 'absolute',
    top: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 20,
  },
  floatPlusView: {
    position: 'absolute',
    top: -10,
    right: -10,
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 20,
  },
  bottomView: {
    fontSize: 20,
    color: config.Constant.COLOR_WHITE,
    backgroundColor: config.Constant.COLOR_PRIMARYLIGHT,
    padding: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  drop: {
    width: config.Constant.SCREEN_WIDTH * 0.83,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
