import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  StatusBar,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modules from '../modules';
import CustDropdown from '../component/CustDropdown';
import CustButton from '../component/CustButton';
import PayuMoney, {HashGenerator} from 'react-native-payumoney';
import CustInput from '../component/CustInput';

export default class RegisterNewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCategory: 0,
      Category: [],
      selectPayment: 0,
      r_name: '',
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
      dataSource: null,
    };
  }
  componentWillMount = async () => {
    try {
      var dataSource = this.props.route.params.item;
      if (!!dataSource) {
        this.setState({
          dataSource,
          selectCategory: dataSource.Category == 'Model: Male' ? 0 : 1,
          selectPayment: dataSource.is_offline_request == 1 ? 2 : 1,
        });
      }
    } catch (error) {}
    this.getData();
  };
  updateData = async () => {
    if (!this.state.selectPayment) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the payment type',
      );
    } else if (!this.state.r_name) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please enter Reference',
      );
    } else if (this.state.selectPayment == '1') {
      var uId = null;
      try {
        uId = await AsyncStorage.getItem('uId');
      } catch (error) {}
      var selectCategoryName = '';
      this.state.Category.map((item, index) => {
        if (item.value == this.state.selectCategory) {
          selectCategoryName = item.label;
        }
      });
      const formDataPrice = new FormData();
      formDataPrice.append('uId', uId);

      formDataPrice.append(
        'Category',
        this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
      );
      formDataPrice.append('Reference', this.state.r_name);

      config.Constant.showLoader.showLoader();
      var dataPrice = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GetPrice,
        formDataPrice,
      );
      config.Constant.showLoader.hideLoader();
      //alert(JSON.stringify(dataPrice))
      if (!!dataPrice) {
        var hashCode = await HashGenerator({
          key: dataPrice.key,
          amount: dataPrice.Price,
          email: dataPrice.email,
          txnId: dataPrice.transationid,
          productName: dataPrice.product,
          firstName: dataPrice.name,
          salt: dataPrice.salt,
        });
        const payData = {
          key: dataPrice.key,
          amount: dataPrice.Price,
          email: dataPrice.email,
          txnId: dataPrice.transationid,
          productName: dataPrice.product,
          firstName: dataPrice.name,
          phone: '9639999999',
          merchantId: '7312244',
          successUrl:
            'https://www.payumoney.com/mobileapp/payumoney/success.php',
          failedUrl:
            'https://www.payumoney.com/mobileapp/payumoney/failure.php',
          //isDebug: true,
          hash: hashCode,
        };

        PayuMoney(payData)
          .then(async (data) => {
            // Payment Success
            console.log(JSON.stringify(data));
            if (data.success == true) {
              var uId = null;
              try {
                uId = await AsyncStorage.getItem('uId');
              } catch (error) {}

              const formDataPrice = new FormData();
              formDataPrice.append('uId', uId);
              formDataPrice.append(
                'Category',
                this.state.selectCategory == 0
                  ? 'Model: Male'
                  : 'Model: Female',
              );
              formDataPrice.append('Reference', this.state.r_name);
              config.Constant.showLoader.showLoader();
              var dataPrice = await modules.APIServices.PostApiCall(
                config.ApiEndpoint.GetPrice,
                formDataPrice,
              );
              config.Constant.showLoader.hideLoader();
              if (!!dataPrice) {
                const formData = new FormData();
                formData.append('uId', uId);
                formData.append('registrationid', this.state.dataSource.Rid);
                formData.append(
                  'Category',
                  this.state.selectCategory == 0
                    ? 'Model: Male'
                    : 'Model: Female',
                );
                formData.append('Amount', dataPrice.Price);
                formData.append(
                  'Payment_Mode',
                  this.state.selectPayment == '1' ? 'Online' : 'Offline',
                );
                formData.append(
                  'Trasaction_ID',
                  data.response.result.paymentId,
                );
                formData.append('Reference', this.state.r_name);
                formData.append('Remarks', data.response.message);
                config.Constant.showLoader.showLoader();
                var data = await modules.APIServices.PostApiCall(
                  config.ApiEndpoint.EditRegistration,
                  formData,
                );
                config.Constant.showLoader.hideLoader();
                if (!!data && data.status == 'Success') {
                  modules.DropDownAlert.showAlert(
                    'success',
                    '',
                    'Update form successfully complete',
                  );
                  this.props.navigation.pop();
                }
              }
            }
          })
          .catch((e) => {
            // Payment Failed
            console.log(e);
          });
      }
    } else {
      var uId = null;
      try {
        uId = await AsyncStorage.getItem('uId');
      } catch (error) {}

      const formDataPrice = new FormData();
      formDataPrice.append('uId', uId);
      formDataPrice.append(
        'Category',
        this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
      );
      config.Constant.showLoader.showLoader();
      var dataPrice = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GetPrice,
        formDataPrice,
      );
      config.Constant.showLoader.hideLoader();
      if (!!dataPrice) {
        const formData = new FormData();
        formData.append('uId', uId);
        formData.append(
          'Category',
          this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
        );
        formData.append('Amount', dataPrice.Price);
        formData.append(
          'Payment_Mode',
          this.state.selectPayment == '1' ? 'Online' : 'Offline',
        );
        formData.append('Trasaction_ID', '');
        formData.append('Remarks', '');
        formData.append('Reference', this.state.r_name);
        formData.append('registrationid', this.state.dataSource.Rid);

        config.Constant.showLoader.showLoader();
        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.EditRegistration,
          formData,
        );
        config.Constant.showLoader.hideLoader();
        if (!!data && data.status == 'Success') {
          modules.DropDownAlert.showAlert(
            'success',
            '',
            'Update form successfully complete',
          );
          this.props.navigation.pop();
        }
      }
    }
  };
  onVerify = async () => {
    if (!this.state.selectPayment) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please select the payment type',
      );
    } else if (!this.state.r_name) {
      modules.DropDownAlert.showAlert(
        'error',
        'Error',
        'Please enter Reference',
      );
    } else if (this.state.selectPayment == '1') {
      var uId = null;
      try {
        uId = await AsyncStorage.getItem('uId');
      } catch (error) {}
      var selectCategoryName = '';
      this.state.Category.map((item, index) => {
        if (item.value == this.state.selectCategory) {
          selectCategoryName = item.label;
        }
      });
      const formDataPrice = new FormData();
      formDataPrice.append('uId', uId);
      formDataPrice.append(
        'Category',
        this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
      );
      formDataPrice.append('Reference', this.state.r_name);

      config.Constant.showLoader.showLoader();
      var dataPrice = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GetPrice,
        formDataPrice,
      );
      config.Constant.showLoader.hideLoader();
      //alert(JSON.stringify(dataPrice))
      if (!!dataPrice) {
        var hashCode = await HashGenerator({
          key: dataPrice.key,
          amount: dataPrice.Price,
          email: dataPrice.email,
          txnId: dataPrice.transationid,
          productName: dataPrice.product,
          firstName: dataPrice.name,
          salt: dataPrice.salt,
        });
        const payData = {
          key: dataPrice.key,
          amount: dataPrice.Price,
          email: dataPrice.email,
          txnId: dataPrice.transationid,
          productName: dataPrice.product,
          firstName: dataPrice.name,
          phone: '9639999999',
          merchantId: '7312244',
          successUrl:
            'https://www.payumoney.com/mobileapp/payumoney/success.php',
          failedUrl:
            'https://www.payumoney.com/mobileapp/payumoney/failure.php',
          //isDebug: true,
          hash: hashCode,
        };
        // if (true) {
        //   var uId = null;
        //   try {
        //     uId = await AsyncStorage.getItem('uId');
        //   } catch (error) {}

        //   const formDataPrice = new FormData();
        //   formDataPrice.append('uId', uId);
        //   formDataPrice.append(
        //     'Category',
        //     this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
        //   );
        //   formDataPrice.append('Reference', this.state.r_name);
        //   config.Constant.showLoader.showLoader();
        //   var dataPrice = await modules.APIServices.PostApiCall(
        //     config.ApiEndpoint.GetPrice,
        //     formDataPrice,
        //   );
        //   config.Constant.showLoader.hideLoader();
        //   if (!!dataPrice) {
        //     const formData = new FormData();
        //     formData.append('uId', uId);
        //     formData.append(
        //       'Category',
        //       this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
        //     );
        //     formData.append('Amount', dataPrice.Price);
        //     formData.append(
        //       'Payment_Mode',
        //       this.state.selectPayment == '1' ? 'Online' : 'Offline',
        //     );
        //     formData.append('Trasaction_ID', 'data.response.result.paymentId');
        //     formData.append('Remarks', 'data.response.message');
        //     formData.append('Reference', this.state.r_name);
        //     config.Constant.showLoader.showLoader();
        //     var data = await modules.APIServices.PostApiCall(
        //       config.ApiEndpoint.RegisterUser,
        //       formData,
        //     );
        //     config.Constant.showLoader.hideLoader();
        //     if (!!data && data.status == 'Success') {
        //       modules.DropDownAlert.showAlert(
        //         'success',
        //         '',
        //         'Registration successfully complete',
        //       );
        //       this.props.navigation.pop();
        //     }
        //   }
        // }
        // return true;
        PayuMoney(payData)
          .then(async (data) => {
            // Payment Success
            console.log(JSON.stringify(data));
            if (data.success == true) {
              var uId = null;
              try {
                uId = await AsyncStorage.getItem('uId');
              } catch (error) {}

              const formDataPrice = new FormData();
              formDataPrice.append('uId', uId);
              formDataPrice.append(
                'Category',
                this.state.selectCategory == 0
                  ? 'Model: Male'
                  : 'Model: Female',
              );
              formDataPrice.append('Reference', this.state.r_name);
              config.Constant.showLoader.showLoader();
              var dataPrice = await modules.APIServices.PostApiCall(
                config.ApiEndpoint.GetPrice,
                formDataPrice,
              );
              config.Constant.showLoader.hideLoader();
              if (!!dataPrice) {
                const formData = new FormData();
                formData.append('uId', uId);
                formData.append(
                  'Category',
                  this.state.selectCategory == 0
                    ? 'Model: Male'
                    : 'Model: Female',
                );
                formData.append('Amount', dataPrice.Price);
                formData.append(
                  'Payment_Mode',
                  this.state.selectPayment == '1' ? 'Online' : 'Offline',
                );
                formData.append(
                  'Trasaction_ID',
                  data.response.result.paymentId,
                );
                formData.append('Remarks', data.response.message);
                formData.append('Reference', this.state.r_name);
                config.Constant.showLoader.showLoader();
                var data = await modules.APIServices.PostApiCall(
                  config.ApiEndpoint.RegisterUser,
                  formData,
                );
                config.Constant.showLoader.hideLoader();
                if (!!data && data.status == 'Success') {
                  modules.DropDownAlert.showAlert(
                    'success',
                    '',
                    'Registration successfully complete',
                  );
                  this.props.navigation.pop();
                }
              }
            }
          })
          .catch((e) => {
            // Payment Failed
            console.log(e);
          });
      }
    } else {
      var uId = null;
      try {
        uId = await AsyncStorage.getItem('uId');
      } catch (error) {}

      const formDataPrice = new FormData();
      formDataPrice.append('uId', uId);
      formDataPrice.append(
        'Category',
        this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
      );
      config.Constant.showLoader.showLoader();
      var dataPrice = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GetPrice,
        formDataPrice,
      );
      config.Constant.showLoader.hideLoader();
      if (!!dataPrice) {
        const formData = new FormData();
        formData.append('uId', uId);
        formData.append(
          'Category',
          this.state.selectCategory == 0 ? 'Model: Male' : 'Model: Female',
        );
        formData.append('Amount', dataPrice.Price);
        formData.append(
          'Payment_Mode',
          this.state.selectPayment == '1' ? 'Online' : 'Offline',
        );
        formData.append('Trasaction_ID', '');
        formData.append('Remarks', '');
        formData.append('Reference', this.state.r_name);
        config.Constant.showLoader.showLoader();
        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.RegisterUser,
          formData,
        );
        config.Constant.showLoader.hideLoader();
        if (!!data && data.status == 'Success') {
          modules.DropDownAlert.showAlert(
            'success',
            '',
            'Registration successfully complete',
          );
          this.props.navigation.pop();
        }
      }
    }
  };
  getData = async () => {
    var uId = null;
    try {
      uId = await AsyncStorage.getItem('uId');
    } catch (error) {}
    if (!!uId) {
      const formData = new FormData();
      formData.append('uId', '1');
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.CategoryList,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        data.map((item, index) => {
          data[index].label = item.Name;
          data[index].value = index + 1;
        });
        this.setState({
          Category: data,
        });
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
          Navigation={this.props.navigation}
          title={
            !!this.state.dataSource ? 'Update Registration' : 'New Registration'
          }
          onPressLeft={() => {
            this.props.navigation.pop();
          }}
        />
        {/* <CustDropdown
          containerStyle={styles.drop}
          data={this.state.Category}
          placeholder={'Select Category'}
          Value={this.state.selectCategory}
          onChange={(date) => {
            this.setState({
              selectCategory: date,
            });
          }}
        /> */}
        {!!this.state.dataSource && (
          <Text
            style={{
              fontSize: 20,
              marginTop: 20,
              color: 'black',
              width: '95%',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            Register Id = {this.state.dataSource.Rid}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
            alignSelf: 'center',
            marginTop: !!this.state.dataSource ? 10 : 30,
          }}>
          <TouchableOpacity
            disabled={!!this.state.dataSource}
            onPress={() => {
              this.setState({
                selectCategory: 0,
              });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                this.state.selectCategory == 0
                  ? require('../assets/images/SelectR.png')
                  : require('../assets/images/unselectedRound.png')
              }
              resizeMode={'contain'}
              style={{width: 20, height: 20}}
            />
            <Text style={{fontSize: 18, color: 'black', marginHorizontal: 15}}>
              Model: Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!!this.state.dataSource}
            onPress={() => {
              this.setState({
                selectCategory: 1,
              });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                this.state.selectCategory == 1
                  ? require('../assets/images/SelectR.png')
                  : require('../assets/images/unselectedRound.png')
              }
              resizeMode={'contain'}
              style={{width: 20, height: 20}}
            />
            <Text style={{fontSize: 18, color: 'black', marginHorizontal: 15}}>
              Model: Female
            </Text>
          </TouchableOpacity>
        </View>

        <CustDropdown
          containerStyle={styles.drop}
          data={this.state.payments}
          placeholder={'Select Payment Type'}
          Value={this.state.selectPayment}
          onChange={(date) => {
            this.setState({
              selectPayment: date,
            });
          }}
        />
        <CustInput
          containerStyle={{width: '90%', alignSelf: 'center'}}
          value={this.state.r_name}
          textContainerStyle={config.Constant.COLOR_PRIMARY}
          title={'Reference'}
          onChangeText={(r_name) => {
            this.setState({
              r_name,
            });
          }}
        />
        <CustButton
          onPress={() => {
            if (!!this.state.dataSource) {
              this.updateData();
            } else {
              this.onVerify();
            }
          }}
          containerStyle={{
            marginVertical: 30,
            width: '70%',
            height: 45,
            alignSelf: 'center',
          }}
          btnTxt={!!this.state.dataSource ? 'Update Registration' : 'REGISTER'}
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
  drop: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
});
