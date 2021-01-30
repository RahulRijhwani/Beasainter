import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import config from '../config';

export default class CustInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currInd: 0,
			value: '',
			selection: {
				start: 0,
				end: 0
			}
		};
	}

	render() {
		const { containerStyle, textContainerStyle, title, value, onChangeText, keyboardType } = this.props;
		// const {selection} = this.state;
		return (
			<View
				// pointerEvents={editable != undefined && editable == false ? 'none' : 'auto'}
				style={[ styles.container, { ...containerStyle } ]}
			>
				<Text style={styles.txtStyle}>{title}</Text>
				<TextInput
					keyboardType={!!keyboardType ? keyboardType : 'default'}
					value={value}
					style={[ styles.inputStyle, { ...textContainerStyle } ]}
					onChangeText={!!onChangeText && onChangeText}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	txtStyle: {
		fontSize: 18,
		color: config.Constant.COLOR_PRIMARY
	},
	inputStyle: {
		fontSize: 16,
		borderWidth: 1,
		borderColor: config.Constant.COLOR_PRIMARY,
		backgroundColor: 'white',
		marginTop: 5,
		width: '100%',
		padding: 5,
		color: config.Constant.COLOR_PRIMARY
	}
});
