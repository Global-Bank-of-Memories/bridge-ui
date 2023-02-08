import { Injectable, NgZone } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable()
export class AppService {
	constructor(private ngZone: NgZone) {}

	public injectWeb3(): void {
		this.ngZone.runOutsideAngular(() => {
			const scriptWeb3 = document.createElement('script');

			scriptWeb3.type = 'text/javascript';
			scriptWeb3.src = environment.web3Src;

			window.document.body.appendChild(scriptWeb3);
		});
	}
}
