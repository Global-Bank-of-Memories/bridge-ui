/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { Component, Input } from '@angular/core';

export type IconType = 'regular' | 'light' | 'solid' | string;

/**
 * @name IconConfig
 * @description an interface to define the configuration for the icon
 */
export interface IconConfig {
	/**
	 * @description name of the icon being used
	 */
	name: string;

	/**
	 * @description type of the specified icon
	 */
	type?: IconType;

	/**
	 * @description fill color of the icon
	 */
	fill?: string;

	/**
	 * @description stroke color of the icon
	 */
	stroke?: string;

	/**
	 * @description width of the icon in format '{X}px'
	 */
	width?: string;

	/**
	 * @description height of the icon in format '{X}px'
	 */
	height?: string;

	/**
	 * @description a class name to be applied to the component
	 */
	className?: string;
}

@Component({
	selector: 'gbm-icon-base',
	template: ''
})
export class IconBaseComponent {
	/**
	 * @description a width of the icon
	 */
	@Input()
	public width!: string | number;

	/**
	 * @description a height of the icon
	 */
	@Input()
	public height!: string | number;

	/**
	 * @description an icon type to apply, defaults to regular, can also be light or solid depending on the icon
	 */
	@Input()
	public type!: IconType;

	/**
	 * @description a class name to be applied to the component
	 */
	@Input()
	public className!: string;

	/**
	 * @description theme color or Hex value (#111111) used to fill the icon/SVG
	 */
	@Input()
	public fill!: string;

	/**
	 * @description theme color or Hex value (#111111) used to stroke the icon/SVG
	 */
	@Input()
	public stroke!: string;
}
