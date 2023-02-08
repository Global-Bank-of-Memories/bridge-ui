import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HeaderService {
	private headerStyleSetStream: Subject<string> = new Subject<string>();

	public updateStyleSet(setName: string): void {
		this.headerStyleSetStream.next(setName || '');
	}

	public getStyleSet(): Observable<string> {
		return this.headerStyleSetStream.asObservable();
	}
}
