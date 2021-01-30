import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import CustDrawer from '../component/CustDrawer';
import Home from '../screens/Home';
import config from '../config';
const Drawer = createDrawerNavigator();

export default (DrawerNavigation = () => {
	return (
		<Drawer.Navigator
			headerMode={'none'}
			gestureHandlerProps={false}
			drawerStyle={{width:config.Constant.SCREEN_WIDTH*0.85,height:config.Constant.SCREEN_HEIGHT*0.85}}
			drawerContent={(props) => {
				return <CustDrawer props={props} />;
			}}
		>
			{/* <Drawer.Screen name="Home" component={MainPage} /> */}
			<Drawer.Screen name="Home" component={Home} />
		</Drawer.Navigator>
	);
});
