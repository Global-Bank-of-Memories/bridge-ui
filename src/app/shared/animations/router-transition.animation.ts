/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const RouterTransition = trigger('RouteAnimations', [
	transition('* => *', [
		query(':enter, :leave', style({ display: 'block', width: '100%', minHeight: '30vh' }), { optional: true }),
		group([
			query(':enter', [style({ opacity: 0, height: 0 }), animate('0.3s ease-in', style({ opacity: 1 }))], {
				optional: true
			}),
			query(':leave', [style({ opacity: 1 }), animate('0.3s ease-out', style({ opacity: 0 }))], { optional: true })
		])
	])
]);
