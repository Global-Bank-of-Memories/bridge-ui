import { Component } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { GenericFormControls, GenericFormGroup } from './generic-form-base-model';

@Component({
	selector: 'generic-form-base',
	template: ''
})
export class GenericFormBaseComponent<TControls, TModel> {
	private _basicFormControls: any;

	constructor(private formBuilder: FormBuilder) {}

	public setFormControls<T>(config: GenericFormControls<T>): void {
		this._basicFormControls = config.basicFormControls;
	}

	public getFormForModule(): GenericFormGroup<TControls, TModel> {
		return this.formBuilder.group({
			...this._basicFormControls
		}) as GenericFormGroup<TControls, TModel>;
	}

	public isShowErrorCondition(formControl: AbstractControl | null, onlyDirty: boolean = false): boolean {
		if (!formControl) {
			return false;
		}
		const inValidityCondition = !onlyDirty ? formControl?.dirty || formControl?.touched : formControl?.dirty;

		return formControl.invalid && inValidityCondition;
	}

	public isShowValidCondition(formControl: AbstractControl | null, onlyDirty: boolean = false): boolean {
		if (!formControl) {
			return false;
		}
		const validityCondition = !onlyDirty ? formControl?.dirty || formControl?.touched : formControl?.dirty;

		return formControl.valid && validityCondition;
	}
}
