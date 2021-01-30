import { checkInternetConnection, manageApiResponseCode } from '../Util/Utilities';
import config from '../config';
import modules from './index';

const GetApiCall = async (url, header, showNoInternetMessage = true, manageApiResponse = true) => {
	const isInternet = await checkInternetConnection();

	if (!isInternet) {
		if (showNoInternetMessage) {
			modules.DropDownAlert.showAlert('error', config.Strings.NO_INTERNET, config.Strings.NO_INTERNET_MESSAGE);
		}
		return null;
	}

	const rawResponse = await fetch(url, {
		method: 'GET',
		headers: {}
	})
		.then((r) => r.json())
		.catch((exc) => {
			config.Constant.showLoader.hideLoader();
			modules.DropDownAlert.showAlert('error', '', config.Strings.SOME_THING_WENT_WRONG);
			return null;
		});

	if (!manageApiResponse) {
		return null;
	} else if (rawResponse === null) {
		return null;
	} else if (rawResponse.status_code === undefined) {
		return rawResponse;
	} else if (rawResponse.status_code === 200 || rawResponse.status_code === 101) {
		return rawResponse;
	} else {
		manageApiResponseCode(rawResponse);
		return null;
	}
};

const PostApiCall = async (url, payLoad, header, showNoInternetMessage = true, manageApiResponse = true) => {
	const isInternet = await checkInternetConnection();
	if (!isInternet) {
		if (showNoInternetMessage) {
			modules.DropDownAlert.showAlert('error', config.Strings.NO_INTERNET, config.Strings.NO_INTERNET_MESSAGE);
		}
		return null;
	}

	if (!!payLoad && Object.keys(payLoad).length > 0) {
		const rawResponse = await fetch(url, {
			method: 'POST',
			headers: {},
			body: payLoad
		})
			.then((r) => r.text())
			.then((r) => {
				return JSON.parse(r);
			})
			.catch((exc) => {
				config.Constant.showLoader.hideLoader();
				modules.DropDownAlert.showAlert('error', '', config.Strings.SOME_THING_WENT_WRONG);
				return null;
			});
		if (!manageApiResponse) {
			return null;
		} else if (rawResponse === null) {
			return null;
		} else if (rawResponse.status_code === undefined) {
			return rawResponse;
		} else if (rawResponse.status_code === 200 || rawResponse.status_code === 101) {
			return rawResponse;
		} else {
			manageApiResponseCode(rawResponse);
			return null;
		}
	} else {
		const rawResponse = await fetch(url, {
			method: 'POST',
			headers: {}
		})
			.then((r) => r.json())
			.catch((exc) => {
				modules.DropDownAlert.showAlert('error', '', config.Strings.SOME_THING_WENT_WRONG);
				return null;
			});

		if (!manageApiResponse) {
			return null;
		} else if (rawResponse === null) {
			return null;
		} else if (rawResponse.status_code === undefined) {
			return rawResponse;
		} else if (rawResponse.status_code === 200 || rawResponse.status_code === 101) {
			return rawResponse;
		} else {
			manageApiResponseCode(rawResponse);
			return null;
		}
	}
};

export default {
	GetApiCall,
	PostApiCall
};
