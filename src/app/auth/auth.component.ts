import { Component } from '@angular/core';

@Component({
	selector: 'br-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.less']
})
export class AuthComponent {
	public backgroundElements = new Array(15).fill(0);
}
