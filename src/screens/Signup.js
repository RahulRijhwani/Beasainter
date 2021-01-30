import React from 'react';
import { StyleSheet, ImageBackground, StatusBar, ScrollView, Image, View, Text } from 'react-native';
import CustInput from '../component/CustInput';
import CustButton from '../component/CustButton';
import config from '../config';
import Header from '../component/header';

export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: '',
			name: '',
			email: '',
			cName: '',
			Address_1: '',
			Address_2: '',
			City: '',
			State: '',
			Country: '',
			Website: '',
			Mobile: '',
			logo: ''
		};
	}
	render() {
		const {
			num,
			name,
			email,
			cName,
			Address_1,
			Address_2,
			City,
			State,
			Country,
			Website,
			Mobile,
			logo
		} = this.state;
		return (
			<View style={styles.container}>
				<StatusBar hidden={false} translucent backgroundColor="transparent" barStyle={'dark-content'} />
				<Header
					onPressLeft={() => {
						this.props.navigation.pop();
					}}
					title={'SIGNUP'}
				/>
				<ScrollView
					bounces={false}
					showsVerticalScrollIndicator={false}
					style={{ width: '90%', alignSelf: 'center' }}
				>
					<CustInput
						containerStyle={{ marginTop: 30 }}
						value={name}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Name'}
						onChangeText={(name) => {
							this.setState({
								name
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={email}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Email'}
						onChangeText={(email) => {
							this.setState({
								email
							});
						}}
					/>

					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={cName}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Company Name'}
						onChangeText={(cName) => {
							this.setState({
								cName
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={Address_1}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Address Line 1'}
						onChangeText={(Address_1) => {
							this.setState({
								Address_1
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={Address_2}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Address Line 2'}
						onChangeText={(Address_2) => {
							this.setState({
								Address_2
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={City}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'City'}
						onChangeText={(City) => {
							this.setState({
								City
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={State}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'State'}
						onChangeText={(State) => {
							this.setState({
								State
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={Country}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Country'}
						onChangeText={(Country) => {
							this.setState({
								Country
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={Website}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Website'}
						keyboardType={'numeric'}
						onChangeText={(Website) => {
							this.setState({
								Website
							});
						}}
					/>
					<CustInput
						containerStyle={{ marginTop: 10 }}
						value={Mobile}
						textContainerStyle={config.Constant.COLOR_PRIMARY}
						title={'Mobile'}
						onChangeText={(Mobile) => {
							this.setState({
								Mobile
							});
						}}
					/>
					<CustButton
						onPress={() => {
							this.props.navigation.navigate('OtpScreen');
						}}
						containerStyle={{ marginTop: 20 }}
						btnTxt={'Get OTP'}
					/>
					<CustButton
						onPress={() => {
							this.props.navigation.navigate('OtpScreen');
						}}
						containerStyle={{ marginTop: 20 }}
						btnTxt={'Sign up'}
					/>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	}
});
