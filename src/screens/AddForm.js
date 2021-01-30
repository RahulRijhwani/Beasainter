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
import CustButton from '../component/CustButton';

export default class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
    };
  }
  componentWillMount = async () => {
    this.props.navigation.addListener('focus', () => {
      this.getData();
    });
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
        config.ApiEndpoint.UserStatus,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (!!data) {
        this.setState({
          listData: data,
        });
      }
    }
  };
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={!!item.is_paid && item.is_paid == '1'}
        onPress={() => {
          this.props.navigation.navigate('RegisterNewForm', {item});
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomColor: 'grey',
          padding: 15,
          borderBottomWidth: 0.5,
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 18, color: 'black'}}>
            Registration ID = {item.Rid}
          </Text>
          <Text style={{fontSize: 18, color: 'black'}}>{item.Category}</Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: !!item.is_paid && item.is_paid == '1' ? 'green' : 'red',
          }}>
          {!!item.is_paid && item.is_paid == '1' ? 'Approved' : 'Pending'}
        </Text>
      </TouchableOpacity>
    );
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
          title={'Registration Forms'}
          // onPressRight={() => {
          //   this.props.navigation.navigate('RegisterNewForm');
          // }}
        />
        {this.state.listData.length > 0 ? (
          <FlatList
            data={this.state.listData}
            extraData={this.state}
            renderItem={this.renderItem}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <CustButton
              onPress={() => {
                this.props.navigation.navigate('RegisterNewForm');
              }}
              containerStyle={{
                marginVertical: 30,
                width: '70%',
                height: 45,
                alignSelf: 'center',
              }}
              btnTxt={'REGISTER'}
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
    backgroundColor: 'white',
  },
});
