/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { Component, Input, OnInit, Type } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ModalContainerService } from './modal-container.service';

@Component({
	selector: 'gbm-modal',
	templateUrl: './modal-container.component.html',
	styleUrls: ['./modal-container.component.less']
})
export class ModalContainerComponent implements OnInit {
	@Input() public title = '';
	@Input() public modalContent!: Type<any>;

	constructor(public activeModal: NgbActiveModal, private modalContainerService: ModalContainerService) {}

	public ngOnInit(): void {
		this.modalContainerService
			.getCloseModalEvent()
			.pipe(take(1))
			.subscribe(event => {
				if (event) {
					this.activeModal.close();
				}
			});
	}
}
