 
 
import { Config } from './types';

export const defaultConfig: Config = {
	api: {
		arkeUrl: '',
		finexUrl: '',
		ieoAPIUrl: '/api/v2/ieo',
		sunshineUrl: '/api/v2/sunshine',
		airdropUrl: '/api/v2/airdrop',
		stakeUrl: '/api/v2/stake',
		walletUrl: '/api/v2/wallet',
		referralUrl: '/api/v2/referral',
		competitionUrl: '/api/v2/competition',
		authUrl: 'https://sqa-earnings.vercel.app',
		tradeUrl: 'https://api.mdrijonhossainjibonyt.xyz/api/v2/',
		applogicUrl: 'https://api.mdrijonhossainjibonyt.xyz/api/v2/applogic',
		rangerUrl: `wss://streem.mdrijonhossainjibonyt.xyz`,
		holderUrl: '/api/v2/holder',
		transactionUrl: '/api/v2/transaction',
		statisticUrl: '/api/v2/statistic',
		newKycUrl: '/api/v2/newKyc',
		bannerUrl: '/api/v2/banner',
		withdrawLimitUrl: '/api/v2/withdrawLimit',
		telegram : 'https://bot.mdrijonhossainjibonyt.xyz/'
	},
	minutesUntilAutoLogout: '360',
	withCredentials: false,
	finex: false,
	gaTrackerKey: 'G-XZ7D8B0TW8',
	rangerReconnectPeriod: '1',
	msAlertDisplayTime: '5000',
	incrementalOrderBook: true,
	isResizable: false,
	isDraggable: false,
	languages: ['en', 'ru'],
	sessionCheckInterval: '15000',
	balancesFetchInterval: '15000',
	passwordEntropyStep: 14,
	showLanding: true,
	sentryEnabled: false,
	kycSteps: ['email', 'phone', 'profile', 'document', 'address'],
	// api: {
	// 	authUrl: '',
	// 	tradeUrl: '',
	// 	applogicUrl: '',
	// 	rangerUrl: '',
	// 	arkeUrl: '',
	// 	finexUrl: '',
	// 	ieoAPIUrl: '',
	// 	sunshineUrl: '',
	// 	airdropUrl: '',
	// 	stakeUrl: '',
	// 	walletUrl: '',
	// 	referralUrl: '',
	// 	transactionUrl: '',
	// },
	// minutesUntilAutoLogout: '30',
	// rangerReconnectPeriod: '1',
	// withCredentials: true,
	storage: {},
	// gaTrackerKey: '',
	// msAlertDisplayTime: '5000',
	// incrementalOrderBook: false,
	// finex: false,
	// isResizable: false,
	// isDraggable: false,
	// languages: ['en'],
	// sessionCheckInterval: '15000',
	// balancesFetchInterval: '15000',
	// passwordEntropyStep: 0,
	// showLanding: true,
	// sentryEnabled: false,
	// kycSteps: ['email', 'profile', 'document', 'address'],
};

export const Cryptobase = {
	config: defaultConfig,
};

 
 
 
//end custome env
Cryptobase.config.storage = Cryptobase.config.storage || {};

export const competitionUrl = () => Cryptobase.config.api.competitionUrl;
export const tradeUrl = () => Cryptobase.config.api.tradeUrl;
export const authUrl = () => Cryptobase.config.api.authUrl;
export const applogicUrl = () => Cryptobase.config.api.applogicUrl;
export const sunshineUrl = () => Cryptobase.config.api.sunshineUrl;
export const airdropUrl = () => Cryptobase.config.api.airdropUrl;
export const ieoAPIUrl = () => Cryptobase.config.api.ieoAPIUrl;
export const stakeUrl = () => Cryptobase.config.api.stakeUrl;
export const walletUrl = () => Cryptobase.config.api.walletUrl;
export const referralUrl = () => Cryptobase.config.api.referralUrl;
export const transactionUrl = () => Cryptobase.config.api.transactionUrl;
export const statisticUrl = () => Cryptobase.config.api.statisticUrl;
export const newKycUrl = () => Cryptobase.config.api.newKycUrl;
export const bannerUrl = () => Cryptobase.config.api.bannerUrl;
export const withdrawLimitUrl = () => Cryptobase.config.api.withdrawLimitUrl;
export const rangerUrl = () => Cryptobase.config.api.rangerUrl;
export const arkeUrl = () => Cryptobase.config.api.arkeUrl || tradeUrl();
export const finexUrl = () => Cryptobase.config.api.finexUrl || tradeUrl();
export const minutesUntilAutoLogout = (): string => Cryptobase.config.minutesUntilAutoLogout || '5';
export const withCredentials = () => Cryptobase.config.withCredentials;
export const defaultStorageLimit = () => Cryptobase.config.storage.defaultStorageLimit  
export const orderBookSideLimit = () => Cryptobase.config.storage.orderBookSideLimit  
export const gaTrackerKey = (): string => Cryptobase.config.gaTrackerKey || '';
export const msAlertDisplayTime = (): string => Cryptobase.config.msAlertDisplayTime || '5000';
export const rangerReconnectPeriod = (): number =>
	Cryptobase.config.rangerReconnectPeriod ? Number(Cryptobase.config.rangerReconnectPeriod) : 1;
export const incrementalOrderBook = (): boolean => Cryptobase.config.incrementalOrderBook || false;
export const isResizableGrid = (): boolean => Cryptobase.config.isResizable || false;
export const isDraggableGrid = (): boolean => Cryptobase.config.isDraggable || false;
export const languages =
	Cryptobase.config.languages && Cryptobase.config.languages.length > 0 ? Cryptobase.config.languages : ['en-US'];
export const sessionCheckInterval = (): string => Cryptobase.config.sessionCheckInterval || '15000';
export const balancesFetchInterval = (): string =>   Cryptobase.config.balancesFetchInterval;
export const isFinexEnabled = (): boolean => Cryptobase.config.finex || false;
export const passwordEntropyStep = (): number => Cryptobase.config.passwordEntropyStep;
export const showLanding = (): boolean => Cryptobase.config.showLanding;
export const sentryEnabled = () => Cryptobase.config.sentryEnabled || defaultConfig.sentryEnabled;
 
export const telegramUrl = () =>  defaultConfig.api.telegram;