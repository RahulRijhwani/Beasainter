import React from 'react';
import {StyleSheet, View, AppState, Text} from 'react-native';
import modules from '../modules';
import DropdownAlert from 'react-native-dropdownalert';
import CustLoader from './CustLoader';
import config from '../config';
import NetInfo from '@react-native-community/netinfo';

export default class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      quotPopup: false,
      appState: AppState.currentState,
	  orderData: null,
	  adUnitID:'ca-app-pub-7068657101504676/4937892527'
    };
  }

  componentDidMount = () => {
    config.Constant.showLoader = this.showLoader;
    AppState.addEventListener('change', this._handleAppStateChange);
  };
  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
  };
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) {}
    }
    this.setState({appState: nextAppState});
  };
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}

        <CustLoader ref={(showLoader) => (this.showLoader = showLoader)} />
        <DropdownAlert
          ref={(dropDownRef) =>
            modules.DropDownAlert.setDropDownRef(dropDownRef)
          }
          translucent={true}
          closeInterval={2000}
          updateStatusBar={false}
          onTap={(data) => {}}
          messageNumOfLines={5}
          containerStyle={{
            backgroundColor: config.Constant.COLOR_PRIMARY,
          }}
        />
        {/* <FullAddBanner adUnitID={this.state.adUnitID} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
