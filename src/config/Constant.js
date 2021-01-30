import { Dimensions, Platform } from 'react-native';

const is_in_beta = true;

const API_BASEURL = is_in_beta
	? 'https://admin.beasa.in/api/'
	: 'https://admin.beasa.in/api/';

export default (Constant = {
	// app details
	APP_LINK_IOS: '',
	APP_LINK_ANDROID: '',

	// api keys
	API_KEY_GOOGLE_YOU_TUBE: '',

	//Upload Data
	uploadArray: [],

	//Chat page
	isChatOpen: false,
	FCM_TOKEN:'',

	// color
	COLOR_PRIMARY: '#2b262c',
	COLOR_WHITE: '#ffffff',
	COLOR_BLACK: '#000000',
	COLOR_DARK_TEXT: '#1A1C36',
	COLOR_LIGHT_GREY: '#9A9A9A',
	COLOR_GREY_BG: '#f5f5f5',
	COLOR_TRANSPARENT: 'rgba(0,0,0,0)',
	COLOR_BORDER:'#666666',

	COLOR_PRIMARYLIGHT: '#000',
	COLOR_GREY: '#E5E5E5',
	COLOR_TEXT_GREY: '#333333',
	COLOR_GREEN: '#4CAE4E',
	COLOR_YELLOW: '#F0B310',
	adUnitID: 'ca-app-pub-7068657101504676/4937892527',
	// font
	FONT_LATO_BOLD: 'Lato-Bold',

	FONT_OS_BOLD: 'OpenSans-Bold',
	FONT_OS_SEMI_BOLD: 'OpenSans-Semibold',
	FONT_OS_REGULAR: 'OpenSans-Regular',
	// FONT_OS_REGULAR: 'OpenSans-Bold',

	// screen dimension
	SCREEN_WIDTH: Dimensions.get('screen').width,
	SCREEN_HEIGHT: Dimensions.get('screen').height,

	API_BASEURL: API_BASEURL,
	IS_TABLET: false,

	//Socket
	socket: null,
	fcmToken: '',
	USER_DATA: null,
	RootNavigation: null,
	showLoader: '',
	currentOrder: 0,
	selectedImage: '',
	currBalance: '0',
	viewHeight:0,
	is_profile_pending:false,
	is_profile_pending_msg:'Your profile is incomplete.',
});
