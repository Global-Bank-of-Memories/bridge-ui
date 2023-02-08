/**
 * @author Oleh Kuznets
 * Author GitHub: https://github.com/oleh-kuznets
 * © 2022 Oleh Kuznets, Bank of Memories Ltd. All rights reserved.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export const LabelKeywords = ['beta'];

@Component({
	selector: 'gbm-heading',
	templateUrl: './heading.component.html',
	styleUrls: ['./heading.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent implements OnInit {
	@Input()
	public title!: string | undefined;

	@Input()
	public color = 'var(--static-black)';

	@Input()
	public tag = 'h1';

	@Input()
	public dotColor = '';

	@Input()
	public className = 'gbm-heading-1';

	public labelKeyword = '';

	public ngOnInit(): void {
		const labelKeyword = LabelKeywords.find(keyword => (this.title || '').toLowerCase().includes(keyword));

		if (labelKeyword) {
			const regex = new RegExp(labelKeyword, 'ig');
			this.title = (this.title || '').replace(regex, '').trim();
			this.labelKeyword = labelKeyword;
		}
	}
}
