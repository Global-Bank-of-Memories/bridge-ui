/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */
import { animate, animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';

export const TOGGLE_MENU_ANIMATION = [
	trigger('toggleMenu', [
		state(
			'*',
			style({
				overflowX: 'hidden',
				overflowY: 'hidden',
				opacity: '1'
			})
		),
		state(
			'void',
			style({
				overflowX: 'hidden',
				overflowY: 'hidden',
				opacity: '0'
			})
		),
		transition('* => void', [query('@toggleMenuItems', animateChild()), query(':self', animate('250ms ease-out'))]),
		transition('void => *', [animate('250ms ease-out'), query('@toggleMenuItems', animateChild(), { optional: true })])
	]),
	trigger('toggleMenuItems', [
		transition('void => *', [
			query(
				':enter',
				style({
					opacity: '0',
					transform: 'translateX(-1.25em) translateY(-0.125em)'
				})
			),
			query(
				':enter',
				stagger('50ms', [
					animate(
						'315ms ease-out',
						style({
							opacity: '1',
							transform: 'translateX(0) translateY(0)'
						})
					)
				])
			)
		]),
		transition('* => void', [
			query(
				':leave',
				style({
					opacity: 1,
					transform: 'translateX(0) translateY(0)'
				})
			),
			query(
				':leave',
				stagger('-10ms', [
					animate(
						'150ms ease-in',
						style({
							opacity: 0,
							transform: 'translateX(-1.25em) translateY(-0.125em)'
						})
					)
				])
			)
		])
	])
];
