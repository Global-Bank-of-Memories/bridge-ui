/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import {
	Component,
	ComponentFactoryResolver,
	Input,
	OnChanges,
	SimpleChanges,
	Type,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { IconConfig, IconType } from '@shared/components/icon/icon-base.component';
import { IconService } from '@shared/components/icon/icon.service';
import { getThemeColor, isHexValue } from '@shared/services/theme/theme.model';

@Component({
	selector: 'gbm-icon',
	template: '<ng-template #iconComponent></ng-template>'
})
export class IconComponent implements OnChanges {
	/**
	 * @description name of the icon used to lookup
	 */
	@Input()
	public name!: string | undefined;

	/**
	 * @description theme color or Hex value (#111111) used to fill the icon/SVG
	 */
	@Input()
	public fill: string | undefined = '#000000';

	/**
	 * @description theme color or Hex value (#111111) used to fill the icon/SVG
	 */
	@Input()
	public stroke = 'inherit';

	/**
	 * @description width to set the icon (pixel based)
	 */
	@Input()
	public width = '18px';

	/**
	 * @description height to set the icon (pixel based)
	 */
	@Input()
	public height = '18px';

	/**
	 * @description custom CSS class
	 */
	@Input()
	public className = '';

	/**
	 * @description an icon type to apply, defaults to regular, can also be light or solid depending on the icon
	 */
	@Input()
	public type: IconType = 'regular';

	/**
	 * @description container to render icon
	 */
	@ViewChild('iconComponent', { read: ViewContainerRef, static: true })
	public container!: ViewContainerRef;

	public icon!: unknown;

	public icons!: unknown;

	constructor(private resolver: ComponentFactoryResolver, private iconService: IconService) {}

	public ngOnChanges(changes: SimpleChanges): void {
		Object.keys(changes).map(attributeType => {
			if (
				attributeType &&
				changes[attributeType].currentValue &&
				changes[attributeType].currentValue !== changes[attributeType].previousValue
			) {
				this.updateIcon();
			}
		});
	}

	/**
	 * @description call the IconService to fetch the icon and create a component from the response
	 */
	public updateIcon(): void {
		if (this.name && this.setIcon(this.iconService.getIcon(this.name))) {
			this.setIconProperties(this.createComponent(this.icon as Type<unknown>) as IconConfig);
		}
	}

	/**
	 * @description sets the icon returned from IconService
	 */
	public setIcon(icon: unknown): unknown {
		return (this.icon = icon);
	}

	/**
	 * @description sets the icons properties
	 */
	public setIconProperties(
		component: IconConfig,
		width = this.width,
		height = this.height,
		fill = this.fill,
		stroke = this.stroke,
		type = this.type,
		className = this.className
	): IconConfig {
		component.width = width;
		component.height = height;
		component.className = className ? `gbm-icon ${className}` : 'gbm-icon';
		component.type = type;

		if (fill) {
			const theme = fill.split('_');
			if (isHexValue(fill)) {
				component.fill = fill;
			} else if (theme.length > 1) {
				component.fill = getThemeColor(theme[0], theme[1]);
			} else {
				component.fill = fill;
			}
		} else {
			component.fill = '#000000';
		}

		const themeStroke = stroke.split('_');
		if (isHexValue(stroke)) {
			component.stroke = stroke;
		} else if (themeStroke.length > 1) {
			component.stroke = getThemeColor(themeStroke[0], themeStroke[1]);
		} else {
			component.stroke = stroke;
		}

		return component;
	}

	/**
	 * @description create a component using the factory resolver and inserts into parent component (Icon)
	 */
	public createComponent(component: Type<unknown>): unknown | null {
		if (component) {
			// Create component factory for Icon
			const componentFactory = this.resolver.resolveComponentFactory(component);
			// Clear target Icons Container
			this.container.clear();
			// Create and inject component into parent inner container
			const componentRef = this.container.createComponent(componentFactory);
			return componentRef.instance;
		}

		return null;
	}
}
