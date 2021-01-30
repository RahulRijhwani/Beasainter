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
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import CustSearch from '../component/CustSearch';
import modules from '../modules';
import FastImage from 'react-native-fast-image';
import {getValid, getValidMessage} from '../Util/Utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRow: [],
      catName: '',
      payments: [
        {
          label: 'Online',
          value: 1,
        },
        {
          label: 'Offline',
          value: 2,
        },
      ],
      underApp: false,
      listData: [],
      showData: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      this.getData();
      this.getDataRegistration();
    });
  };
  getDataRegistration = async () => {
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!!uId) {
      const formData = new FormData();
      formData.append('uId', uId);
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.UserStatus,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        data.map((itm, ind) => {
          if (itm.is_paid == 1) {
            this.setState({
              showData: true,
            });
          } else {
            this.setState({
              underApp: true,
            });
          }
        });
        this.setState({
          listData: data,
        });
      }
    }
  };
  getData = async () => {
    const formData = new FormData();
    formData.append('category', '1');
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_SUB_CATEGORY,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      if (data.length > 0) {
        this.setState({
          dataRow: data,
        });
      } else {
        this.setState({
          dataRow: [],
        });
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Something went wrong please try again',
      );
    }
  };
  renderSubItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderColor: config.Constant.COLOR_PRIMARY,
          borderWidth: 0,
          paddingBottom: 5,
          paddingHorizontal: 3,
          marginVertical: 0,
          width: '33.33%',
        }}
        onPress={async () => {
          if (!!item && !!item.pId) {
            this.props.navigation.navigate('PosterCInner', {
              posterId: item.pId,
            });
            return;
            Alert.alert(
              'Confirmation',
              await getValidMessage(!!item && !!item.Points ? item.Points : 0),
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: (await getValid(
                    !!item && !!item.Points ? item.Points : 0,
                  ))
                    ? 'Spend Points'
                    : 'Purchase Points',
                  onPress: async () => {
                    if (await getValid(item.Points)) {
                      this.props.navigation.navigate('PosterCInner', {
                        posterId: item.pId,
                      });
                    } else {
                      this.props.navigation.navigate('Wallet');
                    }
                  },
                },
              ],
            );
          } else {
            modules.DropDownAlert.showAlert(
              'error',
              '',
              'There are no posters in this category',
            );
          }
        }}>
        {!!item.Icon && (
          <View style={styles.floatTxtView}>
            <FastImage
              style={{width: 35, height: 35}}
              resizeMode={'contain'}
              source={{uri: item.Icon}}
            />
          </View>
        )}
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
          //   onPressLeft={() => {
          //     this.props.navigation.pop();
          //   }}
          Navigation={this.props.navigation}
          title={'Posters'}
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

          {!!this.state.showData ? (
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
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {!!this.state.underApp
                  ? 'Please wait for approval from admin side'
                  : 'Please register your account first'}
              </Text>
            </View>
          )}
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
