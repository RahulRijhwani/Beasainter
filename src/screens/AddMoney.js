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
  Alert,
  ScrollView,
} from 'react-native';
import config from '../config';
import {getStatusBarHeight, isIphoneX} from '../Util/Utilities';
import RNIap, {
  acknowledgePurchaseAndroid,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
  consumePurchaseAndroid,
} from 'react-native-iap';
import CustButton from '../component/CustButton';
import DialogInput from 'react-native-dialog-input';
//,'pid7', 'pid8', 'pid9', 'pid10'

//const skuTitleAppNameRegex = /(?> \\(.+?\\))$/g
const itemSkus = Platform.select({
  ios: ['pid1'],
  android: ['pid7', 'pid8', 'pid9', 'pid10'],
});

export default class AddMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedId: '',
      receipt: '',
      getBalance: '0',
      isDialogVisible: false,
      demoCodeStatus: '',
      titleName: '',
      discount: '',
      inputText: '',
    };
  }
  componentWillMount = async () => {
    var result = await RNIap.initConnection();
    this.getSubscriptions();
    if (!config.Constant.USER_DATA || !config.Constant.USER_DATA.Name) {
      //this.props.navigation.navigate('Profile');
      //modules.DropDownAlert.showAlert('error', '', 'Please setup your company profile first');
    }
    purchaseErrorListener((error: PurchaseError) => {
      config.Constant.showLoader.hideLoader();
    });
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        config.Constant.showLoader.hideLoader();
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              // If consumable (can be purchased again)
              consumePurchaseAndroid(purchase.purchaseToken);
              // If not consumable
              //acknowledgePurchaseAndroid(purchase.purchaseToken);
            }
            const ackResult = await finishTransaction(purchase);
            console.log(JSON.stringify(receipt));

            this.setState({receipt}, () => {
              this.updateDB();
            });
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
      },
    );
    this.getBalance();
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
      this.setState({
        getBalance: data.Balance,
      });
    }
  };
  /* 
	pId 1 Starter 50 - 40
	pId 2 Value  100- 90
	pId 3 Full 200- 200
	pId 4 Saving 500- 525
	pId 5 Bonanza 1000- 1100
	pId 6 Mini 10- 10
	*/
  getAmount = (pId) => {
    var selectedPrice = '0';
    this.state.products.map((item, index) => {
      if (pId == item.productId) {
        selectedPrice = item.price;
      }
    });
    return selectedPrice;
  };
  getPoints = (pId) => {
    if (pId == 'pid7') {
      return '1';
    } else if (pId == 'pid8') {
      return '3';
    } else if (pId == 'pid9') {
      return '6';
    } else if (pId == 'pid10') {
      return '12';
    }
    return '1';
  };
  sendInput = async (promoTxt) => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    formData.append('Promocode', promoTxt);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.PROMO_CODE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data && !!data.Status && !data.Status.includes('Invalid')) {
      modules.DropDownAlert.showAlert('success', '', data.Status);
      this.setState({
        demoCode: promoTxt,
        demoCodeStatus: data.Status,
      });
      this.onTextViewRef.focus();
    } else {
      modules.DropDownAlert.showAlert('error', '', 'Invalid Promo Code');
      this.setState({
        demoCode: '',
        demoCodeStatus: '',
      });
    }
  };
  updateDB = async () => {
    var receipt = this.state.receipt;
    var receiptJson = JSON.parse(receipt);
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    formData.append('Duration_In_Month', this.getPoints(receiptJson.productId));
    formData.append('Amount_Paid', this.getAmount(receiptJson.productId));
    formData.append('Transaction_ID', receiptJson.orderId);

    if (!!this.state.demoCode) {
      formData.append('Promocode', demoCode);
    }
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.PURCHASE_POINT,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    modules.DropDownAlert.showAlert(
      'success',
      '',
      'Point is purchased and successfully added into your account',
    );
    await this.getData();
  };
  getData = async () => {
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!!uId) {
      const formData = new FormData();
      formData.append('uId', uId);
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.VIEW_PROFILE,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        config.Constant.USER_DATA = !!data && !!data.Mobile ? data : null;
        if (!!config.Constant.USER_DATA) {
          config.Constant.USER_DATA.uId = uId;
          this.props.navigation.pop();
        }
      }
    }
  };
  requestPurchase = async (sku) => {
    try {
      config.Constant.showLoader.showLoader();
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.log(err.message);
    }
  };
  CountDiscount = (month, price) => {
    if (month == '1') {
      return '';
    } else {
      var basePrice = '';
      this.state.products.map((item, index) => {
        if (this.getValidName(item.title).trim() == '1') {
          basePrice = item.price;
        }
      });
      //999*100/1788
      var mul = price * 100;
      var baseMul = basePrice * month;
      return `SAVE ${parseFloat((100 - mul / baseMul).toFixed(0))}%`;
    }
  };
  componentDidMount = async () => {};
  getSubscriptions = async () => {
    config.Constant.showLoader.showLoader();
    try {
      const products = await RNIap.getProducts(itemSkus);

      var freeTrialDay = '',
        freeTrialDayPlanIndex = -1;
      products.sort(function (a, b) {
        var keyA = parseInt(a.title),
          keyB = parseInt(b.title);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      products.map((item, index) => {
        if (this.getValidName(item.title).trim() == '1') {
          this.setState({
            selectedId: itemSkus[index],
            discount: '',
            titleName: `My Plan ${this.getValidName(item.title)} Month`,
          });
        }
      });

      var savingPer = 0;
      if (products.length > 1) {
        savingPer = 100 - (products[1].price * 100) / (products[0].price * 12);
      }

      this.setState({products, freeTrialDay, freeTrialDayPlanIndex, savingPer});
      config.Constant.showLoader.hideLoader();
    } catch (err) {
      config.Constant.showLoader.hideLoader();
      console.log(err.code + err.message);
    }
  };
  _scrollToBottomY = 0;
  getValidName = (productTitleWithAppName) => {
    var productTitleWithoutAppName = productTitleWithAppName.substring(
      0,
      productTitleWithAppName.indexOf('('),
    );
    return productTitleWithoutAppName;
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
          <Text style={styles.headerTitle}>{this.state.titleName}</Text>
          <Text style={styles.headerDecs}>{this.state.discount}</Text>
        </ImageBackground>
        <ScrollView
          ref={(ref) => (this.scrollViewRef = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this._scrollToBottomY = contentHeight;
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            {this.state.products.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      selectedId: itemSkus[index],
                      titleName: `My Plan ${this.getValidName(
                        item.title,
                      )} Month`,
                      discount: this.CountDiscount(
                        this.getValidName(item.title).trim(),
                        parseFloat(parseFloat(item.price).toFixed(2)),
                      ),
                    });
                  }}
                  style={[
                    styles.packView,
                    {
                      backgroundColor:
                        index % 2 == 0
                          ? config.Constant.COLOR_PRIMARY
                          : config.Constant.COLOR_PRIMARYLIGHT,
                    },
                  ]}>
                  <View style={[styles.historyRow, {marginVertical: 0}]}>
                    <View style={styles.historyRow}>
                      {/* <Image
                        source={
                          this.state.selectedId == itemSkus[index]
                            ? require('../assets/images/circleFilled.png')
                            : require('../assets/images/circle.png')
                        }
                        resizeMode={`contain`}
                        style={styles.innerIcon}
                      /> */}
                      <Text
                        style={[
                          styles.titleTxt,
                          {
                            backgroundColor:
                              index % 2 == 0
                                ? config.Constant.COLOR_PRIMARYLIGHT
                                : config.Constant.COLOR_PRIMARY,
                          },
                        ]}>
                        {this.getValidName(item.title)}
                      </Text>
                      <Text style={styles.decTxt}>{'MONTHS'}</Text>
                      <Text style={styles.amountTxt}>
                        {parseFloat(parseFloat(item.price).toFixed(2))} Rs/-
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* <CustButton
              onPress={() => {
                !!this.state.selectedId
                  ? this.requestPurchase(this.state.selectedId)
                  : modules.DropDownAlert.showAlert(
                      'error',
                      '',
                      'Please select any option for purchase',
                    );
                //this.props.navigation.navigate('OtpScreen');
              }}
              containerStyle={{
                width: '90%',
                alignSelf: 'center',
                marginVertical: 15,
              }}
              btnTxt={'Purchase'}
            /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '80%',
                alignSelf: 'center',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight:'700',
                  marginHorizontal: 0,
                  color: config.Constant.COLOR_TEXT_GREY,
                }}>
                Benefits of Premium{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '80%',
                alignSelf: 'center',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                source={require('../assets/images/rightSign.png')}
                style={{tintColor: 'green', width: 20, height: 20}}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: 10,
                  color: config.Constant.COLOR_TEXT_GREY,
                }}>
                Remove ads for ever
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '80%',
                alignSelf: 'center',
                marginBottom: 20,
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                source={require('../assets/images/rightSign.png')}
                style={{tintColor: 'green', width: 20, height: 20}}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginHorizontal: 10,
                  color: config.Constant.COLOR_TEXT_GREY,
                }}>
                Free access for all post
              </Text>
            </View>
            {/* <CustButton
              onPress={() => {
                this.setState({
                  isDialogVisible: true,
                });
              }}
              containerStyle={{
                width: '90%',
                alignSelf: 'center',
                marginBottom: 15,
              }}
              btnTxt={'Have a promo code?'}
            /> */}
            {!!this.state.demoCodeStatus && (
              <Text
                ref={(ref) => (this.onTextViewRef = ref)}
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  fontSize: 20,
                  marginHorizontal: 20,
                  marginBottom: 20,
                  marginTop: -10,
                  color: 'green',
                }}>
                {'\n' + this.state.demoCodeStatus}
              </Text>
            )}
            <View style={styles.rowContainer}>
              <View style={styles.rowInnerContainer}>
                {!!this.state.inputText && (
                  <Text style={styles.inputTitle}>Promo Code</Text>
                )}
                <TextInput
                  placeholder={'Promo Code'}
                  value={this.state.inputText}
                  onChangeText={(inputText) => {
                    this.setState({
                      inputText,
                    });
                  }}
                  style={styles.inputTxt}
                />
              </View>
              <Text
                onPress={() => {
                  if (!!this.state.inputText) {
                    this.sendInput(this.state.inputText);
                  } else {
                    this.setState({
                      demoCode: '',
                      demoCodeStatus: '',
                    });
                  }
                }}
                style={{
                  color: config.Constant.COLOR_PRIMARY,
                  fontSize: 18,
                  paddingHorizontal: 5,
                }}>
                Apply Code
              </Text>
            </View>
            {/* <Text
              onPress={() => {
                !!this.state.selectedId
                  ? this.requestPurchase(this.state.selectedId)
                  : modules.DropDownAlert.showAlert(
                      'error',
                      '',
                      'Please select any option for purchase',
                    );
              }}
              style={{
                fontSize: 22,
                color: config.Constant.COLOR_PRIMARY,
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight: '700',
                marginVertical:20
              }}>
              GET PREMIUM
            </Text> */}
            <CustButton
              onPress={() => {
                !!this.state.selectedId
                  ? this.requestPurchase(this.state.selectedId)
                  : modules.DropDownAlert.showAlert(
                      'error',
                      '',
                      'Please select any option for purchase',
                    );
              }}
              containerStyle={{
                width: '90%',
                alignSelf: 'center',
                marginVertical: 20,
              }}
              btnTxt={'GET PREMIUM'}
            />
          </View>
        </ScrollView>
        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          title={'Promo Code'}
          message={'Enter Promo Code'}
          hintInput={''}
          submitInput={(inputText) => {
            this.setState({
              isDialogVisible: false,
            });
            this.sendInput(inputText);
          }}
          submitText={'Apply'}
          closeDialog={() => {
            this.setState({
              isDialogVisible: false,
            });
          }}
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
  mainContainer: {width: '100%', alignSelf: 'center'},
  historyRow: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  packView: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: config.Constant.COLOR_PRIMARY,
    borderRadius: 200,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
  },
  titleTxt: {
    fontSize: 20,
    color: config.Constant.COLOR_WHITE,
    width: 50,
    height: 50,
    borderRadius: 50,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: '700',
  },
  decTxt: {
    fontSize: 15,
    color: config.Constant.COLOR_WHITE,
    flex: 1,
    textAlign: 'left',
    marginLeft: -10,
  },
  amountTxt: {
    fontSize: 20,
    color: config.Constant.COLOR_WHITE,
    fontWeight: '700',
  },
  innerIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: config.Constant.COLOR_PRIMARY,
  },
  headerStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    paddingTop:
      Platform.OS == 'ios'
        ? getStatusBarHeight() + 5
        : getStatusBarHeight() + 10,
    width: config.Constant.SCREEN_WIDTH,
    height: config.Constant.SCREEN_WIDTH / 2.5,
  },
  headerTitle: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  headerDecs: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  btnView: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -10,
  },
  rowInnerContainer: {
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-around',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  inputTitle: {
    color: config.Constant.COLOR_PRIMARY,
    fontSize: 18,
    marginTop: 5,
    textAlign: 'left',
    //flex: 0.9,
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
  },
});
