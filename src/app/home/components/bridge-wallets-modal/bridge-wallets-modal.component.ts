import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'br-bridge-wallets-modal',
	templateUrl: './bridge-wallets-modal.component.html',
	styleUrls: ['./bridge-wallets-modal.component.less']
})
export class BridgeWalletsModalComponent {
	constructor(public activeModal: NgbActiveModal) {}
}
