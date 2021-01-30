import React, { Component } from 'react';
import { View, ActivityIndicator, Image, Text, StyleSheet } from 'react-native';
import config from '../config';

export default class CustLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			color: '',
			message: 'Loading...',
			showLoader: false
		};
	}

	showLoader = (message, color) => {
		this.setState({
			isVisible: true,
			color: config.Constant.COLOR_PRIMARY,
			message: message ? message : config.Strings.Loading
		});
	};

	hideLoader = () => {
		this.setState({
			isVisible: false
		});
	};

	render() {
		const { isVisible } = Object.keys(this.props).length > 0 ? this.props : this.state;

		return (
			<View
				style={{
					elevation: 10,
					position: 'absolute',
					width: isVisible ? '100%' : '0%',
					height: isVisible ? '100%' : '0%',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10,
					backgroundColor: 'transparent'
				}}
			>
				{isVisible && (
					<View style={styles.innerview}>
						<Image
							style={{ width: 100, height: 100 }}
							resizeMode={'contain'}
							source={require('../assets/images/loadUI.gif')}
						/>
						{/* <Text style={styles.lodingtxt}>{this.state.message}</Text> */}
					</View>
				)}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	innerview: {
		maxHeight: 200,
		backgroundColor: 'rgba(0,0,0,0)',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 10,
		// shadowColor: config.Constant.COLOR_GREY,
		// shadowOffset: {
		// 	width: 2,
		// 	height: 2
		// },
		// shadowRadius: 6,
		// shadowOpacity: 1,
		// elevation: 21
	},
	lodingtxt: {
		color: config.Constant.COLOR_PRIMARY,
		fontSize: 15,
		marginTop: 10
		//fontFamily: config.Constant.FONT_OS_REGULAR
	}
});
