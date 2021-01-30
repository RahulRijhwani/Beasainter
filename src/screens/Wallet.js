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
  ScrollView,
  Platform,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import {getStatusBarHeight, isIphoneX} from '../Util/Utilities';
import modules from '../modules';
import moment from 'moment';
import CustButton from '../component/CustButton';

const itemSkus = Platform.select({
  ios: ['pid1'],
  android: [
    'android.test.purchased',
    'android.test.canceled',
    'android.test.refunded',
    'android.test.item_unavailable',
  ],
});

export default class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getBalance: 0,
      transArr: [],
      headerHeight: 0,
    };
  }
  componentWillMount = async () => {
    //this.getSubscriptions();
    if (!config.Constant.USER_DATA || !config.Constant.USER_DATA.Name) {
      //this.props.navigation.navigate('Profile');
      //modules.DropDownAlert.showAlert('error', '', 'Please setup your company profile first');
    }
    this.props.navigation.addListener('focus', () => {
      this.getBalance();
      this.getHistory();
    });
  };
  getBalance = async () => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_BALANCE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data && !!data.Balance) {
      config.Constant.currBalance = data.Balance;
      this.setState({
        getBalance: data.Balance,
      });
    }
  };
  getHistory = async () => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_HISTORY,
      formData,
    );
    console.log(data);
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      this.setState({
        transArr: data,
      });
    }
  };
  componentDidMount = async () => {};

  addPayment = () => {
    this.props.navigation.navigate('AddMoney');
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
        {/* <Header containerStyle={{backgroundColor: config.Constant.COLOR_PRIMARYLIGHT}} title={''} /> */}
        <ImageBackground
          source={require('../assets/images/walletBackImg.png')}
          style={styles.headerStyle}>
          <TouchableOpacity
            style={styles.btnView}
            onPress={() => {
              this.props.navigation.pop();
            }}>
            <Image
              source={require('../assets/images/arrow-ios-back.png')}
              resizeMode={'contain'}
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Image
              source={require('../assets/images/premium.png')}
              resizeMode={'contain'}
              style={{width: 120, height: 30, marginHorizontal: 20}}
            />
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <Text style={[styles.headerTitle,{marginTop:!!config.Constant.USER_DATA &&
                (config.Constant.USER_DATA.Membership_Status == 'Active')?0:10}]}>
                {!!config.Constant.USER_DATA &&
                  config.Constant.USER_DATA.Membership_Status}
              </Text>
              {!!config.Constant.USER_DATA &&
                (config.Constant.USER_DATA.Membership_Status == 'Active') && (
                <Text style={styles.headerTitle}>
                  {!!config.Constant.USER_DATA
                    ? config.Constant.USER_DATA.Membership_Status == 'Active' &&
                      `upto ${moment(
                        config.Constant.USER_DATA.Renew_Date,
                        'DD-MM-YYYY',
                      ).format('Do MMMM YYYY')}`
                    : ``}
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
        {/* <View
          onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            this.setState({headerHeight: height});
          }}
          style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.btnView}
            onPress={() => {
              this.props.navigation.pop();
            }}>
            <Image
              source={require('../assets/images/arrow-ios-back.png')}
              resizeMode={'contain'}
              style={{
                width: '50%',
                height: '50%',
                tintColor: 'white',
              }}
            />
          </TouchableOpacity>
          <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
            <Text
              style={{
                color: config.Constant.COLOR_WHITE,
                fontSize: 20,
                marginVertical: 10,
              }}>
              Wallet  
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.addPayment();
              }}>
              <Image
                style={{width: 70, height: 70}}
                source={require('../assets/images/walleteTab.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'flex-start'}}>
            <Text
              style={{
                color: config.Constant.COLOR_WHITE,
                fontSize: 20,
                marginVertical: 10,
              }}>
              Available Balance
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: config.Constant.COLOR_WHITE,
                  fontSize: 50,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                {this.state.getBalance}
              </Text>
              <Text
                style={{
                  color: config.Constant.COLOR_WHITE,
                  fontSize: 20,
                  alignSelf: 'flex-start',
                  marginTop: 5,
                }}>
                PT
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={[styles.mainContainer, {marginTop: this.state.headerHeight}]}>
          <View style={styles.mainContainer}>
            {/* <Text
              style={{
                color: config.Constant.COLOR_PRIMARY,
                fontSize: 18,
                marginLeft: config.Constant.SCREEN_WIDTH * 0.1,
                marginTop: 30,
                marginBottom: 10,
              }}>
              History
            </Text> */}
            {/* <TouchableOpacity
              onPress={() => {
                this.addPayment();
              }}
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: config.Constant.COLOR_BLACK,
                  fontSize: 20,
                  marginRight: 10,
                }}>
                Add Balance
              </Text>
              <Image
                resizeMode={'contain'}
                source={require('../assets/images/addBlack.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: config.Constant.COLOR_PRIMARY,
                }}
              />
            </TouchableOpacity> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: config.Constant.SCREEN_WIDTH * 0.9,
                alignSelf: 'center',
              }}>
              <View style={{flex: 1.2, alignItems: 'flex-start'}}>
                <Text
                  style={{
                    color: config.Constant.COLOR_TEXT_GREY,
                    fontSize: 20,
                    marginTop: 10,
                  }}>
                  Current Plan
                </Text>
                {config.Constant.USER_DATA.Membership_Status == 'Active' ? (
                  <Text
                    style={{
                      color: config.Constant.COLOR_TEXT_GREY,
                      fontSize: 16,
                    }}>
                    expire on :{' '}
                    {
                      moment(
                        config.Constant.USER_DATA.Renew_Date,
                        'DD-MM-YYYY',
                      ).format('Do MMM')
                    }
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: config.Constant.COLOR_TEXT_GREY,
                      fontSize: 16,
                    }}>
                    {config.Constant.USER_DATA.Membership_Status}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: '90%',
                  marginRight: 10,
                  width: 0.5,
                  backgroundColor: config.Constant.COLOR_BORDER,
                }}
              />
              <CustButton
                onPress={() => {
                  this.addPayment();
                }}
                containerStyle={{flex: 0.8, borderRadius: 5}}
                btnTxt={
                  config.Constant.USER_DATA.Membership_Status == 'Active'
                    ? 'Renew'
                    : 'Purchase'
                }
              />
            </View>
            {this.state.transArr.map((item, index) => {
              return (
                <View style={styles.historyRowView}>
                  <View style={styles.historyRow}>
                    <View style={[styles.titleTxt, {flex: 1}]}>
                      <Text style={styles.titleTxt}>{item.Descricption}</Text>
                      {/* <Text style={[styles.titleTxt, {fontSize: 13}]}>
                        {moment(item.Date, 'DD-MM-YYYY HH:mm').format(
                          'DD MMM, hh:mm a',
                        )}
                      </Text> */}
                    </View>
                    {/* <Text
                      style={[
                        styles.amountTxt,
                        {color: item.Type == 'Credit' ? 'green' : 'red'},
                      ]}>
                      {item.Type == 'Credit' ? '+ ' : '- '}
                      {item.Points}
                    </Text> */}
                  </View>
                  {/* <Text style={styles.ptView}>PT</Text> */}
                </View>
              );
            })}
          </View>
        </ScrollView>
        {/* <Text style={styles.bottomView}>History</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: config.Constant.COLOR_PRIMARY,
  },
  mainContainer: {width: '100%', alignSelf: 'center'},
  rowContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1,
    backgroundColor: config.Constant.COLOR_PRIMARY,
    position: 'absolute',
    top:
      Platform.OS == 'ios'
        ? getStatusBarHeight() + 5
        : getStatusBarHeight() + 10,
    width: config.Constant.SCREEN_WIDTH * 0.9,
    left: config.Constant.SCREEN_WIDTH * 0.05,
    borderRadius: 5,
  },
  historyRow: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderColor: config.Constant.COLOR_BORDER,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  historyRowView: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginVertical: 10,
    borderColor: config.Constant.COLOR_BORDER,
    paddingHorizontal: 0,
  },
  titleTxt: {
    fontSize: 15,
    color: config.Constant.COLOR_TEXT_GREY,
  },
  ptView: {
    fontSize: 15,
    color: config.Constant.COLOR_WHITE,
    backgroundColor: config.Constant.COLOR_PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 5,
  },
  bottomView: {
    fontSize: 20,
    color: config.Constant.COLOR_WHITE,
    backgroundColor: config.Constant.COLOR_PRIMARY,
    padding: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  amountTxt: {
    fontSize: 15,
  },
  btnView: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  headerStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    paddingTop:
      Platform.OS == 'ios'
        ? getStatusBarHeight() + 5
        : getStatusBarHeight() + 10,
    width: config.Constant.SCREEN_WIDTH,
    height: config.Constant.SCREEN_WIDTH / 2.8,
  },
  headerTitle: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 15,
    marginRight: 15,
  },
  headerDecs: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 30,
    marginBottom: 10,
    marginRight: 15,
  },
});
