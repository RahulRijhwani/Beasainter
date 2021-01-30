import React, {Component} from 'react';
import {View} from 'react-native';
import {AdMobBanner} from 'react-native-admob';
import NetInfo from '@react-native-community/netinfo';
import Constant from '../config/Constant';
import config from '../config';

export default class FullAddBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adUnitID: 'ca-app-pub-3940256099942544/6300978111',
      isConnect: false,
    };
  }
  async componentDidMount() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({isConnect: true});
      } else {
        this.setState({isConnect: false});
      }
    });
  }
  render() {
    return (
      <View style={{width: Constant.SCREEN_WIDTH}}>
        {this.state.isConnect &&
          (!config.Constant.USER_DATA ||
            config.Constant.USER_DATA.Membership_Status != 'Active') && (
            <AdMobBanner
              adSize="fullBanner"
              adUnitID={this.props.adUnitID}
              testDevices={[AdMobBanner.simulatorId]}
              onAdFailedToLoad={(error) => console.error(error)}
            />
          )}
      </View>
    );
  }
}
