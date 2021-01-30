import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import Home from '../screens/Home';
import config from '../config';
import DrawerNavigator from './DrawerNavigator';
import Category from '../screens/Category';
import AddForm from '../screens/AddForm';
import CatList from '../screens/CatList';
const Tab = createBottomTabNavigator();

TabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Registration') {
						iconName = focused
							? require('../assets/images/menuTag.png')
							: require('../assets/images/menuTag.png');
					} else if (route.name === 'Home') {
						iconName = focused
							? require('../assets/images/homeTab.png')
							: require('../assets/images/homeTab.png');
					} else if (route.name === 'Poster') {
						iconName = focused
							? require('../assets/images/addImgIcon.png')
							: require('../assets/images/addImgIcon.png');
					} else if (route.name === 'Contacts') {
						iconName = focused
							? require('../assets/images/customerService.png')
							: require('../assets/images/customerService.png');
					}

					// You can return any component that you like here!
					return <Image resizeMode={'contain'} source={iconName} style={styles.tabImg} />;
				}
			})}
			tabBarOptions={{
				activeTintColor: 'rgb(8,127,123)',
				inactiveTintColor: 'gray',
				showLabel: true,
				tabStyle: { backgroundColor: config.Constant.COLOR_PRIMARY, paddingVertical: 0 },
				labelStyle: {
					fontSize:14,
					color:'white'
				}
			}}
		>
			<Tab.Screen name="Home" component={DrawerNavigator} />
			<Tab.Screen name="Registration" component={AddForm} />
			<Tab.Screen name="Poster" component={CatList} />
			<Tab.Screen name="Contacts" component={Category} />
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	tabImg: {
		height: config.Constant.SCREEN_WIDTH * 0.05,
		width: config.Constant.SCREEN_WIDTH * 0.05,
		tintColor:'white'
	}
});

export default TabNavigator;
