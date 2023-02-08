/**
 * © 2022 HardwareBench Ltd. All rights reserved.
 */

import { Injectable } from '@angular/core';
import { Theme, themes, THEME_KEY } from './theme.model';

@Injectable()
export class ThemeService {
	/**
	 * @description set theme key to local storage
	 * @param color color theme key that identifies theme included in the application
	 */
	public setTheme(theme: string): void {
		localStorage.setItem(THEME_KEY, theme);
	}

	/**
	 * @description init theme by local storage key, if key does not exist, it will returns first theme in themes list by default
	 */
	public initTheme(): void {
		let savedTheme = localStorage.getItem(THEME_KEY);

		if (!savedTheme) {
			localStorage.setItem(THEME_KEY, 'light');
			savedTheme = 'light';
		}

		const selectedTheme = themes.find(theme => theme.name === savedTheme);
		if (selectedTheme) {
			this.setActiveTheme(selectedTheme);
		}
	}

	/**
	 * @description set theme in application root, document object
	 * @param theme if theme includes in themes list it can be used across application, see @interface Theme interface to add new theme
	 */
	private setActiveTheme(theme: Theme): void {
		Object.keys(theme.properties).forEach(property =>
			document.documentElement.style.setProperty(property, theme.properties[property])
		);
	}
}
