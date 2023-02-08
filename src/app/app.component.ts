import { Component, OnInit } from '@angular/core';
import { Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RouterTransition } from '@shared/animations/router-transition.animation';
import { ThemeService } from '@shared/services/theme/theme.service';
import * as variables from '@utils/misc';

@Component({
	selector: 'br-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
	animations: [RouterTransition]
})
export class AppComponent implements OnInit {
	/**
	 * @description handle header view
	 */
	public showHeader = false;

	constructor(private themeService: ThemeService, private router: Router) {}

	public ngOnInit(): void {
		this.themeService.initTheme();
		this.routerListener();
	}

	/**
	 * @description affects on router animation when component is loaded in an outlet
	 * @param outlet application router outlet, acts as a placeholder that Angular dynamically fills based on the current router state.
	 * @returns an information about a route associated with a component that is loaded in an outlet
	 */
	public prepareRoute(outlet: RouterOutlet): Data {
		return outlet && outlet.activatedRouteData;
	}

	/**
	 * @description handle index.html data and application theme params
	 */
	private routerListener(): void {
		this.router.events.subscribe((event: unknown) => {
			if (event instanceof NavigationEnd) {
				this.showHeader = this.isHeaderAvailable(event);
				this.handleDocumentTitle(event);
			}
		});
	}

	/**
	 * @description handle index.html title per loaded router
	 * @param event an event triggered when a navigation ends successfully
	 */
	private handleDocumentTitle(event: NavigationEnd): void {
		const currentRouter = variables.RoutesCatalog.find(
			router => event.url.includes(router.url) && router.url.length > 1
		);

		document.title = currentRouter
			? `${currentRouter.title} - ${variables.DEFAULT_DOCUMENT_TITLE}`
			: `${variables.DEFAULT_DOCUMENT_TITLE_HOME}`;
	}

	/**
	 * @description showing header for appropriate routes
	 * @param event an event triggered when a navigation ends successfully
	 */
	private isHeaderAvailable(event: NavigationEnd): boolean {
		return !variables.RoutesWithoutHeaderCatalog.find(router => event.url.includes(router));
	}
}
