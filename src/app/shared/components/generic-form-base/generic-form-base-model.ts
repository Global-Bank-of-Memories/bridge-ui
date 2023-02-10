import { FormControl, FormGroup } from '@angular/forms';

export interface GenericFormControls<T> {
	basicFormControls: T;
}

export interface GenericFormGroup<C, T> extends FormGroup {
	readonly value: T;
	controls: Record<keyof C, FormControl>;
}
