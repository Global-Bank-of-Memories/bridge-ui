import { Component } from '@angular/core';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { isExternalUrl } from '@shared/services/theme/theme.model';
import { Router } from '@angular/router';
import { TOGGLE_MENU_ANIMATION } from '@shared/animations/toggle-menu.animation';

const SCROLL_AUTO = 'auto';
const SCROLL_HIDDEN = 'hidden';

@Component({
	selector: 'gbm-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.less'],
	animations: [TOGGLE_MENU_ANIMATION, FADE_ANIMATION]
})
export class HeaderComponent {
	public showBurgerMenu = false;

	constructor(private router: Router) {}

	public onLogoClick(): void {
		this.showBurgerMenu = false;
		this.handlePageScroll();
		void this.router.navigate(['/']);
	}

	public toggleMenu(): void {
		this.showBurgerMenu = !this.showBurgerMenu;
		this.handlePageScroll();
	}

	public onBurgerItemClick(url: string | undefined): void {
		if (url) {
			this.showBurgerMenu = false;
			this.handlePageScroll();
			if (isExternalUrl(url)) {
				window.location.href = url;
			} else {
				void this.router.navigate([url]);
			}
		}
	}

	private handlePageScroll(): void {
		document.body.style.overflow = this.showBurgerMenu ? SCROLL_HIDDEN : SCROLL_AUTO;
	}
}
