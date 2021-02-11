import React from 'react';
import { StyleSheet, View, Text, Linking, Platform, StatusBar,TouchableOpacity } from 'react-native';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import config from '../config/index';
import Config from '../config/index';
import CustButton from './CustButton';


export default class AppUpdateScreen extends React.PureComponent {
	_onPressUpdate = () => {
		var url = '';
		if (Platform.OS === 'ios') {
			//url = `itms-apps://itunes.apple.com/us/app/id15036?mt=8`;
		} else {
			url = `market://details?id=com.beasa2&cache_id=${Math.random()}`;
		}
		Linking.openURL(url);
	};

	render() {
		return (
			<View style={styles.container}>
				<StatusBar hidden={false} translucent backgroundColor="transparent" barStyle={'dark-content'} />
				<View style={styles.topView}>
					<FastImage
						style={styles.appUpdateImg}
						resizeMode={FastImage.resizeMode.contain}
						source={require('../assets/images/imgpsh_fullsize_anim.png')}
					/>
				</View>

		<Text style={styles.titleTxt}>Time to update</Text>
				<Text style={styles.messageTxt}>
					{this.props.storeUpdateView ? (
						'Newer version of app is available in store. Please update your app.'
					) : (
						'We added some new feature and fix some bugs to make your experience as smooth as possible.'
					)}
				</Text>

				<View style={styles.bottomView}>
					{this.props.storeUpdateView ? (
						<TouchableOpacity
							style={styles.updateBtn}
							onPress={() => {
								this._onPressUpdate();
							}}
						>
							<Text style={{fontSize:18,color:'white'}}>
								Update
							</Text>
						</TouchableOpacity>
					) : (
						<Progress.Bar
							progress={this.props.progress}
							width={Config.Constant.SCREEN_WIDTH * 0.8}
							borderRadius={0}
							color={Config.Constant.COLOR_PRIMARY}
							unfilledColor={Config.Constant.COLOR_BLACK + '40'}
							borderWidth={0}
							height={3}
							style={styles.progressBar}
						/>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Config.Constant.COLOR_WHITE
	},
	appUpdateImg: {
		width: 250,
		height: 250,
		alignSelf: 'center'
	},
	titleTxt: {
		width: '90%',
		textAlign: 'center',
		fontSize: 23,
		color: Config.Constant.COLOR_BLACK,
		alignSelf: 'center'
	},
	messageTxt: {
		width: '90%',
		textAlign: 'center',
		fontSize: 13,
		color: Config.Constant.COLOR_BLACK,
		marginTop: 10,
		alignSelf: 'center'
	},
	progressBar: {
		alignSelf: 'center'
	},
	updateBtn: {
		width: '90%',
		height:45,
		alignSelf: 'center',
		backgroundColor:config.Constant.COLOR_PRIMARY,
		borderRadius:50,
		justifyContent:'center',
		alignItems:'center'
	},
	topView: {
		height: Config.Constant.SCREEN_HEIGHT * 0.67,
		justifyContent: 'center'
	},
	bottomView: {
		flex: 1,
		justifyContent: 'center'
	}
});
