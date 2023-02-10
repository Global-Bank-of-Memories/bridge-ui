/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const FADE_ANIMATION = trigger('fade', [
	state(
		'void',
		style({
			opacity: 0
		})
	),
	transition('void <=> *', animate('250ms ease-in-out'))
]);

export const fadeInAnimation = (delay = '250ms'): AnimationTriggerMetadata =>
	trigger('fadeIn', [
		state(
			'void',
			style({
				opacity: 0
			})
		),
		transition('void <=> *', animate(`${delay} ease-in-out`))
	]);
