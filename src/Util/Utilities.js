import { Dimensions, Platform, StatusBar } from 'react-native';
import modules from '../modules';
import config from '../config';
import NetInfo from '@react-native-community/netinfo';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const isIphoneX = () => {
	const dimen = Dimensions.get('window');

	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTVOS &&
		(dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
	);
};

const isNumber = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
	utility;
};

const ifIphoneX = (iphoneXStyle, regularStyle) => {
	if (isIphoneX()) {
		return iphoneXStyle;
	}
	return regularStyle;
};

const getStatusBarHeight = (safe) => {
	return Platform.select({
		ios: ifIphoneX(safe ? 44 : 30, 20),
		android: StatusBar.currentHeight
	});
};
const emailValidation = (email) => {
	var emailString = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.+[A-Za-z]{2,64}';
	return email.match(emailString);
};
const mobileValidate = (phone) => {
	var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
	return phone.match(regex);
};
const multisort = (arr, columns, order_by) => {
	if (typeof columns == 'undefined') {
		columns = [];
		for (x = 0; x < arr[0].length; x++) {
			columns.push(x);
		}
	}

	if (typeof order_by == 'undefined') {
		order_by = [];
		for (x = 0; x < arr[0].length; x++) {
			order_by.push('ASC');
		}
	}

	function multisort_recursive(a, b, columns, order_by, index) {
		var direction = order_by[index] == 'DESC' ? 1 : 0;

		var is_numeric = !isNaN(+a[columns[index]] - +b[columns[index]]);

		var x = is_numeric ? +a[columns[index]] : a[columns[index]].toLowerCase();
		var y = is_numeric ? +b[columns[index]] : b[columns[index]].toLowerCase();

		if (x < y) {
			return direction == 0 ? -1 : 1;
		}

		if (x == y) {
			return columns.length - 1 > index ? multisort_recursive(a, b, columns, order_by, index + 1) : 0;
		}

		return direction == 0 ? 1 : -1;
	}

	return arr.sort(function(a, b) {
		return multisort_recursive(a, b, columns, order_by, 0);
	});
};

const manageApiResponseCode = (data) => {
	modules.DropDownAlert.showAlert('error', '', data.message);
	config.Constant.showLoader.hideLoader();
	if (data.status_code === 403) {
		//let navigationRef = Module.RootNavigation.getRef()
		//logoutUser(navigationRef)
	}
};
const checkInternetConnection = () => {
	return new Promise(async (resolve, reject) => {
		const connectionInfo = await NetInfo.fetch();
		resolve(!(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'));
	});
};

const logoutFun = async (navigation) => {
	config.Constant.USER_DATA = {
		token: ''
	};
	await AsyncStorage.removeItem('user_token');
	navigation.dispatch(StackActions.replace('RegistrationScreen'));
};
const getValid = async (point) => {
	const formData = new FormData();
	var valid = false;
	formData.append('uId', config.Constant.USER_DATA.uId);
	config.Constant.showLoader.showLoader();
	var data = await modules.APIServices.PostApiCall(config.ApiEndpoint.GET_BALANCE, formData);
	config.Constant.showLoader.hideLoader();
	if (!!data && !!data.Balance) {
		try {
			debugger;
			currBal = parseInt(data.Balance);
			if (!!currBal && currBal >= parseInt(point)) {
				valid = true;
			}
		} catch (error) {}
	}
	return valid;
};
const getValidMessage = async (point) => {
	const formData = new FormData();
	var valid = `This image spends ${point}points. Your Current balance is`;
	formData.append('uId', config.Constant.USER_DATA.uId);
	config.Constant.showLoader.showLoader();
	var data = await modules.APIServices.PostApiCall(config.ApiEndpoint.GET_BALANCE, formData);
	config.Constant.showLoader.hideLoader();
	if (!!data && !!data.Balance) {
		try {
			var currBal = parseInt(data.Balance);
			if (!!currBal && currBal >= parseInt(point)) {
				valid = `This image spends ${point} points. Your Current balance is ${currBal} points`;
			} else {
				valid = `Your points are not sufficient, please purchase it`;
			}
		} catch (error) {}
	}
	return valid;
};
const AddLog = async () => {
	try {
	  var data = await AsyncStorage.getItem("LogBook");
	  if (!!data) {
		data = JSON.parse(data);
		data.map((itm, inde) => {
		  if (!itm.Endtime) {
			data[inde].Endtime = moment().format("YYYY-MM-DD HH:mm:ss");
		  }
		});
		data.push({
		  Starttime: moment().format("YYYY-MM-DD HH:mm:ss"),
		  Endtime: "",
		});
		console.log("---LOG BOOK---Start LOG" + JSON.stringify(data));
		await AsyncStorage.setItem("LogBook", JSON.stringify(data));
	  } else {
		var data = [];
		data.map((itm, inde) => {
		  if (!itm.Endtime) {
			data[inde].Endtime = moment().format("YYYY-MM-DD HH:mm:ss");
		  }
		});
		data.push({
		  Starttime: moment().format("YYYY-MM-DD HH:mm:ss"),
		  Endtime: "",
		});
		console.log("---LOG BOOK---Start LOG" + JSON.stringify(data));
		await AsyncStorage.setItem("LogBook", JSON.stringify(data));
	  }
	} catch (error) {}
  };
  const EndLog = async () => {
	try {
	  var data = await AsyncStorage.getItem("LogBook");
	  if (!!data) {
		data = JSON.parse(data);
		data.map((itm, inde) => {
		  if (!itm.Endtime) {
			data[inde].Endtime = moment().format("YYYY-MM-DD HH:mm:ss");
		  }
		});
		console.log("---LOG BOOK---END LOG" + JSON.stringify(data));
		await AsyncStorage.setItem("LogBook", JSON.stringify(data));
	  }
	} catch (error) {}
  };
  
  const UploadData = async (isPopup) => {
	try {
	  var data = await AsyncStorage.getItem("LogBook");
	  if (!!data) {
		data = JSON.parse(data);
		data.map((itm, inde) => {
		  if (!itm.Endtime) {
			data[inde].Endtime = moment().format("YYYY-MM-DD HH:mm:ss");
		  }
		});
		console.log("---LOG BOOK---UPLOAD LOG" + JSON.stringify(data));
		await AsyncStorage.removeItem("LogBook");
		const formData = new FormData();
		formData.append("uId", config.Constant.USER_DATA.uId);
		formData.append("data", JSON.stringify(data));
		config.Constant.showLoader.showLoader();
		var data = await modules.APIServices.PostApiCall(
		  config.ApiEndpoint.LOG_BOOK,
		  formData
		);
		config.Constant.showLoader.hideLoader();
		if (!!data && data.status && data.status == "Success") {
		  if (!!isPopup) {
			modules.DropDownAlert.showAlert(
			  "success",
			  "Success",
			  "Logbook uploaded successfully"
			);
		  }
		} else {
		}
	  }
	} catch (error) {}
  };


const Utilities = {
	isIphoneX,
	isNumber,
	manageApiResponseCode,
	getStatusBarHeight,
	emailValidation,
	multisort,
	checkInternetConnection,
	logoutFun,
	mobileValidate,
	getValid,
	getValidMessage,
	AddLog,
  EndLog,
  UploadData,
};

module.exports = Utilities;
