import { Observable } from 'rxjs';

export abstract class NonGbmBridgeBase {
	protected abstract getToken(): Observable<any>;
}
