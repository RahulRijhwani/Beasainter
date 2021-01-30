import React from 'react';
import Component from './src/component/index';
import MainNavigator from './src/navigator/MainNavigator';
import AppUpdateScreen from './src/component/AppUpdateScreen';
import {checkVersion} from 'react-native-check-version';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateDialog: false,
      appUpdateView: false,
      currentProgress: 0,
    };
  }

  componentDidMount = () => {
    this._checkAPPStoreVersion();
  };
  _checkAPPStoreVersion = async () => {
    const check = await checkVersion();
    if (check.needsUpdate) {
      this.setState({appUpdateView: true});
    }
  };
  render() {
    if (!this.state.showUpdateDialog && !this.state.appUpdateView) {
      return (
        <Component.RootComponent>
          <MainNavigator />
        </Component.RootComponent>
      );
    } else {
      return (
        <AppUpdateScreen
          storeUpdateView={this.state.appUpdateView}
          progress={this.state.currentProgress}
        />
      );
    }
  }
}
