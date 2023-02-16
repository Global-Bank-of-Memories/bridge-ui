import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Directive({
	selector: '[gbmAutoFocus]'
})
export class GbmAutoFocusDirective implements AfterViewInit {
	constructor(private el: ElementRef) {}

	public ngAfterViewInit(): void {
		of(this.el)
			.pipe(
				map(elementRef => elementRef.nativeElement), // getting the el
				filter(nativeElement => !!nativeElement), // filtering
				take(1) // avoid memory leak, it will unsubscribe automatically
			)
			// our side effect
			.subscribe(input => {
				input.focus();
			});
	}
}
