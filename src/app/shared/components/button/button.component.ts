/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { Component, Input } from '@angular/core';
import { IconType } from '@shared/components/icon/icon-base.component';

type IconPosition = 'right' | 'left';

@Component({
	selector: 'gbm-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.less']
})
export class ButtonComponent {
	/**
	 * @description button title
	 */
	@Input()
	public title!: string | undefined;

	/**
	 * @description button theme color or Hex value (#ffffff)
	 */
	@Input()
	public color = '#ffffff';

	/**
	 * @description button theme background or Hex value (#000000)
	 */
	@Input()
	public backgroundColor = '#000000';

	/**
	 * @description button width (pixel based)
	 */
	@Input()
	public width = '160px';

	/**
	 * @description button height (pixel based)
	 */
	@Input()
	public height = '40px';

	/**
	 * @description uppercase title
	 */
	@Input()
	public textTransform = 'none';

	/**
	 * @description set CSS class for text
	 */
	@Input()
	public textClassName = '';

	/**
	 * @description custom CSS class
	 */
	@Input()
	public className = '';

	/**
	 * @description icon position (right | left)
	 */
	@Input()
	public iconPosition: IconPosition = 'left';

	/**
	 * @description button icon based on gbm-icon
	 */
	@Input()
	public icon!: Record<string, string | IconType>;

	/**
	 * @description button state enabled/disabled
	 */
	@Input()
	public disabled = false;

	/**
	 * @description loading state
	 */
	@Input()
	public loading = false;

	/**
	 * @description @see IconConfig
	 * @param property from @see IconConfig
	 * @param defaultValue to set a default value for property from @see IconConfig
	 * @returns @see IconConfig
	 */
	public getIcon(property: string, defaultValue: string | IconType): string | IconType {
		return this.icon && this.icon[property] ? this.icon[property] : defaultValue;
	}
}
