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
import FullAddBanner from '../component/FullAddBanner';
export default class QA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArr: [],
    };
  }
  componentWillMount = async () => {
    this.getQA();
  };
  getQA = async () => {
    const formData = new FormData();
    formData.append('uId', config.Constant.USER_DATA.uId);
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.QandA,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (!!data) {
      this.setState({
        dataArr: data,
      });
    }
  };
  toggleExpanded = () => {};
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
          title={'Q & A'}
        />
        <View style={styles.borderView} />
        {this.state.dataArr.map((item, index) => {
          return (
            <View>
              <TouchableOpacity
                onPress={() => this.toggleExpanded(index)}
                style={styles.headerCol}>
                <Text style={[styles.headerTextCol]}>
                  Question : {item.Question}
                </Text>
                {/* <Image
									style={styles.iconStyle}
									resizeMode="contain"
									source={
										item.isCollapse ? (
											require('../res/images/shape1Copy5.png')
										) : (
											require('../res/images/shape1Copy.png')
										)
									}
								/> */}
              </TouchableOpacity>
              {/* <Collapsible style={styles.colStyle} collapsed={item.isCollapse} align="center">
								<View style={styles.contentCol}>
									<Text style={styles.ansTxt}>{item.answers}</Text>
								</View>
							</Collapsible> */}
              <View style={styles.contentCol}>
                <Text style={styles.ansTxt}>Answer : {item.Answer}</Text>
              </View>
              <View style={styles.borderView} />
            </View>
          );
        })}
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
  headerCol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
  },
  colStyle: {width: '90%', alignSelf: 'center'},
  headerTextCol: {
    textAlign: 'left',
    fontSize: 18,
    color: config.Constant.COLOR_PRIMARY,
    flex: 1,
  },
  iconStyle: {width: 15, height: 15},
  contentCol: {
    marginVertical: 10,
    alignItems: 'flex-start',
    width: '90%',
    alignSelf: 'center',
  },
  ansTxt: {
    color: config.Constant.COLOR_PRIMARY,
    alignSelf: 'center',
    textAlign: 'left',
    width: '100%',
    fontSize: 15,
  },
  borderView: {
    marginVertical: 10,
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    borderColor: config.Constant.COLOR_PRIMARY,
  },
});
