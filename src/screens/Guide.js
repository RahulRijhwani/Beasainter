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
} from 'react-native';
import config from '../config';
import Header from '../component/header';
import modules from '../modules';
import PDFView from 'react-native-view-pdf';
import FullAddBanner from '../component/FullAddBanner';

const resourceType = 'url';
export default class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Link: 'http://quickyfly.supersoftsolutions.com/guidepdf.ashx?Id=2',
    };
  }
  componentWillMount = async () => {
    //this.getUrl();
  };
  getUrl = async () => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_GUIDE_URL,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data && !!data.Link) {
      this.setState({
        Link,
      });
    }
  };

  render() {
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
            this.props.navigation.pop();
          }}
          title={'Guide'}
        />
        {!!this.state.Link && (
          <PDFView
            fadeInDuration={250.0}
            style={{flex: 1}}
            resource={this.state.Link}
            resourceType={resourceType}
            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
            onError={(error) => console.log('Cannot render PDF', error)}
          />
        )}
        <FullAddBanner adUnitID={config.Constant.adUnitID} />
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
