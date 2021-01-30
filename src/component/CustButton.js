import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import config from '../config';

export default class CustButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { currInd: 0 };
	}

	render() {
		const { containerStyle, btnTxt, onPress, txtstyle, leftimage, rightimage } = this.props;
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[ styles.container, { ...containerStyle } ]}>
				<Text style={[ styles.txtStyle, { ...txtstyle } ]}>{btnTxt}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		//flexGrow: 1,
		backgroundColor: config.Constant.COLOR_PRIMARY,
		borderRadius: 30,
		borderColor: config.Constant.COLOR_PRIMARY,
		borderWidth: 1,
		shadowColor: config.Constant.COLOR_TRANSPARENT,
		shadowOffset: {
			width: 2,
			height: 2
		},
		shadowRadius: 6,
		shadowOpacity: 1,
		elevation: 5
	},
	txtStyle: {
		//fontFamily: config.Constant.FONT_OS_SEMI_BOLD,
		color: 'white',
		fontSize: 15
	}
});
