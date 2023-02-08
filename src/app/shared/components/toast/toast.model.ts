export enum GbmToastType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger',
	DEFAULT = 'default'
}
export enum GbmToastIcon {
	INFO = 'infoCircle',
	WARNING = 'exclamationCircle',
	DANGER = 'timesCircle',
	SUCCESS = 'checkCircle'
}

export enum GbmToastPositionConfig {
	TOP_RIGHT = 'top_right',
	TOP_LEFT = 'top_left',
	BOTTOM_RIGHT = 'bottom_right',
	BOTTOM_LEFT = 'bottom_left'
}

export const TOAST_DEFAULT_DELAY = 5000;
export const TOAST_DEFAULT_TYPE = GbmToastType.INFO;
export const TOAST_ICON_DEFAULT_WIDTH = '35px';
export const TOAST_ICON_DEFAULT_HEIGHT = '35px';
export const TOAST_ANIMATION_DURATION = '100%';
export const TOAST_ANIMATION_SPACE = '30px';
export const TOAST_DEFAULT_RETENTION_TINE = 200;

export const styleMap = new Map<GbmToastType, GbmToastStyleModel>([
	[
		GbmToastType.INFO,
		{
			iconName: GbmToastIcon.INFO,
			iconWidth: TOAST_ICON_DEFAULT_WIDTH,
			iconHeight: TOAST_ICON_DEFAULT_HEIGHT,
			iconColor: '--blue-50_light',
			progressColor: 'var(--blue-50)'
		}
	],
	[
		GbmToastType.WARNING,
		{
			iconName: GbmToastIcon.WARNING,
			iconWidth: TOAST_ICON_DEFAULT_WIDTH,
			iconHeight: TOAST_ICON_DEFAULT_HEIGHT,
			iconColor: '#DFBF2A',
			progressColor: '#DFBF2A'
		}
	],
	[
		GbmToastType.DANGER,
		{
			iconName: GbmToastIcon.DANGER,
			iconWidth: TOAST_ICON_DEFAULT_WIDTH,
			iconHeight: TOAST_ICON_DEFAULT_HEIGHT,
			iconColor: '--red-60_light',
			progressColor: 'var(--red-60)'
		}
	],
	[
		GbmToastType.SUCCESS,
		{
			iconName: GbmToastIcon.SUCCESS,
			iconWidth: TOAST_ICON_DEFAULT_WIDTH,
			iconHeight: TOAST_ICON_DEFAULT_HEIGHT,
			iconColor: '--light-green-50_light',
			progressColor: 'var(--light-green-50)'
		}
	],
	[
		GbmToastType.DEFAULT,
		{
			iconName: GbmToastIcon.INFO,
			iconWidth: TOAST_ICON_DEFAULT_WIDTH,
			iconHeight: TOAST_ICON_DEFAULT_HEIGHT,
			iconColor: '--blue-60_light',
			progressColor: 'var(--blue-60)'
		}
	]
]);

export interface GbmToastModel {
	header: string;
	body?: string;
	type?: GbmToastType;
	delay?: number;
	remove?: () => void;
}

export interface GbmToastIconModel {
	name: GbmToastIcon;
	width: string;
	height: string;
	fillColor: string;
}

export interface GbmToastStyleModel {
	iconName: GbmToastIcon;
	iconWidth: string;
	iconHeight: string;
	iconColor: string;
	progressColor: string;
}
