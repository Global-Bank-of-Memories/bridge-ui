/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

/**
 * @description Example:
 * {
    name: 'light,
    properties: {
      '--gray-00': '#F8F9FB',
    }
  }
 */
export interface Theme {
	name: string;
	properties: {
		[key: string]: string;
	};
}

const staticPalette = {
	// Static
	'--static-white': '#FFFFFF',
	'--static-black': '#000000',

	// Color Gradient Background: Blue
	'--blue-10': '#EDF4FF',
	'--blue-20': '#C9DEFF',
	'--blue-30': '#97C1FF',
	'--blue-40': '#6EA6FF',
	'--blue-50': '#408BFC',
	'--blue-60': '#0062FF',
	'--blue-70': '#054ADA',
	'--blue-80': '#0530AD',
	'--blue-90': '#061F80',
	'--blue-100': '#051243',

	// Color Gradient Background: Mixed
	'--indigo-50': '#8585F2',
	'--indigo-60': '#4D4DD1',
	'--red-50': '#F06452',
	'--red-60': '#DE432F',
	'--orange-40': '#FF943A',
	'--orange-50': '#F96D41',
	'--orange-60': '#F4511E',
	'--magenta-50': '#EE538B',
	'--magenta-60': '#D12765',
	'--yellow-50': '#F0E053',
	'--light-green-50': '#3AAE37',
	'--violet-50': '#BB6BD9',
	'--light-blue-50': '#56CCF2',

	// Gradient
	'--blue-gradient': 'linear-gradient(135deg, #97ABFF 0%, #123597 100%)',
	'--blue-green-gradient': 'linear-gradient(135deg, #90F7EC 0%, #32CCBC 100%)',
	'--purple-gradient': 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
	'--dark-gradient': 'linear-gradient(180deg, #21272A 0%, #000000 100%)'
};

export const themes: Theme[] = [
	{
		name: 'light',
		properties: {
			// Background: Mixed
			'--cool-gray-00': '#F8F9FB',
			'--cool-gray-10': '#F2F4F8',
			'--cool-gray-20': '#DDE1E6',
			'--cool-gray-30': '#C1C7CD',
			'--cool-gray-40': '#A2A9B0',
			'--cool-gray-50': '#878D96',
			'--cool-gray-60': '#697077',
			'--cool-gray-70': '#4D5358',
			'--cool-gray-80': '#343A3F',
			'--cool-gray-90': '#21272A',
			'--cool-gray-100': '#121619',

			// Background: Opacity/Mixed
			'--cool-gray-op-024': 'rgba(255, 255, 255, 0.24)',

			// Shadow
			'--shadow-default-1': '0px 16px 20px rgba(0, 0, 0, 0.08), 0px 4px 10px rgba(0, 0, 0, 0.08)',

			// Static
			...staticPalette
		}
	}
];

// Variables
export const THEME_KEY = 'theme';

// Helpers
export const isExternalUrl = (url: string): boolean => url.includes('http') || url.includes('https');

export const isHexValue = (value = ''): boolean => new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(value);

export const getTheme = (): string => localStorage.getItem(THEME_KEY) || 'light';

export const getThemeColor = (themeColor: string, themeName: string): string => {
	const currentTheme = themes.find(theme => theme.name === themeName);
	return currentTheme ? currentTheme.properties[themeColor] : '';
};

/**
 * @param color it can be Hex format (#000000) or theme variable (--gray-00_light) by '_' delimiter, '--gray-00' is theme variable, 'light' is theme
 * @returns prefered color in Hex format (#000000)
 */
export const getColor = (color: string | undefined): string => {
	if (color) {
		const theme = color.split('_');

		if (isHexValue(color)) {
			return color;
		}

		if (theme.length > 1) {
			return getThemeColor(theme[0], theme[1]);
		}

		return color;
	}

	return '#000000';
};
