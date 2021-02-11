import React from 'react';
import {StyleSheet, Image, Text, StatusBar, View, Alert} from 'react-native';
import config from '../config';
import Header from '../component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modules from '../modules';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '',
      category: [],
      categorySearch: [],
      monthDate: [],
      monthDateSearch: [],
      entries: [],
      slideCenter: [],
      clickcount: 0,
    };
  }
  componentWillMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      this.setState({
        clickcount: 0,
      });
      await this.getData();
    });
    Alert.alert('Beasa International : ','Poster creation for free please create your poster.')
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
        <Text style={{color: 'black', fontSize: 20, margin: 20}}>
          Hello{' '}
          {!!config.Constant.USER_DATA &&
            !!config.Constant.USER_DATA.Name &&
            config.Constant.USER_DATA.Name}
        </Text>
        <Image
          style={{
            width: config.Constant.SCREEN_WIDTH / 2,
            height: config.Constant.SCREEN_WIDTH / 2,
            alignSelf: 'center',
            marginTop: 30,
          }}
          resizeMode={'contain'}
          source={require('../assets/images/imgpsh_fullsize_anim.png')}
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
});
