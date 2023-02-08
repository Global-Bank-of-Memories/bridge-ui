/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ModalContainerService {
	private closeModalStream: Subject<boolean> = new Subject();

	public getCloseModalEvent(): Observable<boolean> {
		return this.closeModalStream.asObservable();
	}

	public updateCloseModalEvent(event: boolean): void {
		this.closeModalStream.next(event);
	}
}
