import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import Login from '../screens/Login';
import OtpScreen from '../screens/Otp';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import DrawerNavigator from './DrawerNavigator';
import TabNavigator from './TabNavigator';
import RegisterNewForm from '../screens/RegisterNewForm';
import PosterC from '../screens/PosterC';
const Stack = createStackNavigator();

export default (MainNavigator = () => {
	return (
		<NavigationContainer gestureHandlerProps={false}>
			<Stack.Navigator gestureHandlerProps={false} mode="card" headerMode={'none'}>
				<Stack.Screen name="SplashScreen" component={SplashScreen} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="OtpScreen" component={OtpScreen} />
				<Stack.Screen name="Profile" component={Profile} />
				<Stack.Screen name="DrawerNavigator" component={TabNavigator} />
				<Stack.Screen name="Signup" component={Signup} />
				<Stack.Screen name="RegisterNewForm" component={RegisterNewForm} />
				<Stack.Screen name="PosterCInner" component={PosterC} />
				{/* <Stack.Screen name="Category" component={Category} />
				<Stack.Screen name="PosterCInner" component={PosterC} />
				
				<Stack.Screen name="Menu" component={Home} />
				<Stack.Screen name="Wallet" component={Wallet} />
				<Stack.Screen name="AddMoney" component={AddMoney} />
				<Stack.Screen name="Guide" component={Guide} />
				<Stack.Screen name="QA" component={QA} />
				<Stack.Screen name="SavedImage" component={SavedImage} />
				<Stack.Screen name="DisplyPic" component={DisplyPic} /> */}
			</Stack.Navigator>
		</NavigationContainer>
	);
});
