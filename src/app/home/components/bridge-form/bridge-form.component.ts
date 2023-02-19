/* eslint-disable brace-style */
import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GenericFormBaseComponent } from '@shared/components/generic-form-base/generic-form-base.component';
import {
	BridgeBasicFormControls,
	BridgeFormControls,
	BridgeFormGroup,
	BridgeFormModel,
	BRIDGE_BASIC_FORM_CONTROLS
} from './bridge-form.model';
import { PolygonService, validatorUrls } from '@home/services/polygon/polygon.service';
import { BridgeService } from '@home/services/bridge/bridge.service';
import { FADE_ANIMATION } from '@shared/animations/fade.animation';
import { GbmService } from '@home/services/gbm/gbm.service';
import * as _ from 'lodash';
import { LOGGER_TYPES, SubmitState, WalletBaseService } from '@home/services/wallet-base';
import { LoggerDictionary } from '../logger/logger.dictionary';
import { IWalletState } from '@home/services/wallet.model';
import { catchError } from 'rxjs/operators';
import { BigNumber } from '@ethersproject/bignumber';
import { ConcordiumService } from '@home/services/concordium/concordium.service';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'br-bridge-form',
	templateUrl: './bridge-form.component.html',
	styleUrls: ['./bridge-form.component.less'],
	animations: [FADE_ANIMATION]
})
export class BridgeFormComponent
	extends GenericFormBaseComponent<BridgeFormControls, BridgeFormModel>
	implements OnInit, OnChanges
{
	public validationMessage = '';
	public transactionHash = '';
	public withdrawEthereumResponse!: any;
	public formGroup!: BridgeFormGroup;
	public serviceForTransactions!: any;
	public transferPgnToGbmRes!: any;
	public transferCncToGbmRes!: any;

	constructor(
		formBuilder: FormBuilder,
		private polygonService: PolygonService,
		private gbmService: GbmService,
		private injector: Injector,
		private concordiumService: ConcordiumService,
		private decimalPipe: DecimalPipe
	) {
		super(formBuilder);
	}

	public get walletFrom(): IWalletState | null {
		return WalletBaseService.state.find(wallet => wallet.from && wallet.selected) || null;
	}

	public get walletTo(): IWalletState | null {
		return WalletBaseService.state.find(wallet => !wallet.from && wallet.selected) || null;
	}

	public get submitState(): SubmitState {
		return WalletBaseService.submitState;
	}

	public get isDefaultSubmitState(): boolean {
		return WalletBaseService.submitState === SubmitState.SEND_TRANSFER && !WalletBaseService.loading;
	}

	public get loading(): boolean {
		return WalletBaseService.loading;
	}

	public get logs(): string {
		return WalletBaseService.logs;
	}

	public get xdr(): string {
		return WalletBaseService.xdr;
	}

	public get from(): FormControl {
		return this.formGroup.controls.from;
	}

	public get to(): FormControl {
		return this.formGroup.controls.to;
	}

	public ngOnInit(): void {
		this.serviceForTransactions = this.injector.get(GbmService);
		WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
		this.initForm();
		this.setValidators();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.walletTo && this.walletTo?.walletId.length > 3) {
			WalletBaseService.logger(`${this.walletTo?.title} ${LoggerDictionary.WALLETS_CONNECTED}`, LOGGER_TYPES.SUCCESS);
		}
	}

	public onSwitch(): void {
		if (this.walletTo && this.walletTo?.walletId.length < 3) {
			WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
			return;
		}

		WalletBaseService.state = WalletBaseService.state.map(wallet => {
			if (wallet.walletId === this.walletTo?.walletId) {
				return {
					...wallet,
					from: true
				};
			}

			if (wallet.walletId === this.walletFrom?.walletId) {
				return {
					...wallet,
					from: false
				};
			}

			return wallet;
		});

		WalletBaseService.logger(
			`${LoggerDictionary.WALLETS_SWITCHED} ${this.walletFrom?.title} > ${this.walletTo?.title}`
		);
	}

	public onSubmit(): void {
		const { from, to } = this.formGroup.controls;

		if (parseFloat(_.get(this.walletFrom, 'balance', 0).toString()) <= 0) {
			WalletBaseService.logger(LoggerDictionary.NOT_ENOUGH_BALANCE, LOGGER_TYPES.ERROR);
			return;
		}

		if (this.walletTo && this.walletTo?.walletId.length < 3) {
			WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
			return;
		}

		if ((!from.value && !to.value) || (from.value <= 0 && to.value <= 0)) {
			WalletBaseService.logger('Invalid form values. It should be positive float', LOGGER_TYPES.ERROR);
			return;
		}

		if (Number(this.walletFrom.balance) < from.value) {
			WalletBaseService.logger('Not enough balance', LOGGER_TYPES.ERROR);
			return;
		}

		const hasIncorrectMantissaFrom = Number(from.value.toString().split('e-')[1]) > 7;
		const hasIncorrectMantissaTo = Number(to.value.toString().split('e-')[1]) > 7;
		if (hasIncorrectMantissaFrom || hasIncorrectMantissaTo) {
			WalletBaseService.logger('Maximum values after decimal point should be <= 7', LOGGER_TYPES.ERROR);
			return;
		}

		if (this.walletFrom.walletId && this.walletTo.walletId) {
			if (WalletBaseService.submitState === SubmitState.SEND_TRANSFER) {
				this.sendTransfer();
				return;
			}

			if (WalletBaseService.submitState === SubmitState.SIGN) {
				this.sign();
				return;
			}

			if (WalletBaseService.submitState === SubmitState.WITHDRAW) {
				this.withdraw();
				return;
			}
		}
	}

	public withdraw(): void {
		if (this.walletTo?.id === 'pgn') {
			void this.gbmService.handleWithdraw(this.transactionHash, this.walletTo?.walletId || '').then(() => {
				void this.polygonService.getWalletData().toPromise().then(() => {});
			});

			return;
		}

		if (this.walletTo?.id === 'cnc') {
			void this.concordiumService.handleWithdraw(this.transactionHash, this.walletTo?.walletId || '').then(() => {
				void this.polygonService.getWalletData().toPromise().then(() => {});
			});
			return;
		}

		if (this.walletTo?.id === 'gbm') {
			if (this.walletFrom?.id === 'pgn') {
				void this.polygonService
					.sendWithdraw(
						this.transferPgnToGbmRes.transactionHash,
						_.get(this.transferPgnToGbmRes, 'events.Deposit.logIndex', 0)
					)
					.then(() => {
						WalletBaseService.logger(LoggerDictionary.TRANSFERING_COMPLETED);
						WalletBaseService.loading = false;
						WalletBaseService.submitState = SubmitState.SIGN;
					})
					.catch(() => {
						WalletBaseService.loading = false;
					});

				return;
			}

			if (this.walletFrom?.id === 'cnc') {
				void this.concordiumService
					.sendWithdraw(this.transferCncToGbmRes, this.walletTo.walletId)
					.then(() => {
						WalletBaseService.logger(LoggerDictionary.TRANSFERING_COMPLETED);
						WalletBaseService.loading = false;
						WalletBaseService.submitState = SubmitState.SIGN;
					})
					.catch(() => {
						WalletBaseService.loading = false;
					});

				return;
			}
		}
	}

	public sendTransfer(): void {
		const { from, to } = this.formGroup.controls;

		WalletBaseService.loading = true;
		WalletBaseService.logger(`${LoggerDictionary.SENDING_TRANSFER_FROM} ${this.walletFrom?.title}`);

		if (this.walletTo?.id === 'cnc') {
			this.gbmService.sendTransfer(from.value, true).subscribe(xdr => {
				WalletBaseService.xdr = xdr;
				WalletBaseService.logger(LoggerDictionary.TRANSFERING_COMPLETED);
				WalletBaseService.logger(LoggerDictionary.RE_ENTER_PASSWORD, LOGGER_TYPES.WARNING);
				WalletBaseService.loading = false;
				WalletBaseService.submitState = SubmitState.SIGN;
			});

			return;
		}

		if (this.walletTo?.id === 'pgn') {
			this.gbmService.sendTransfer(from.value).subscribe(xdr => {
				WalletBaseService.xdr = xdr;
				WalletBaseService.logger(LoggerDictionary.TRANSFERING_COMPLETED);
				WalletBaseService.logger(LoggerDictionary.RE_ENTER_PASSWORD, LOGGER_TYPES.WARNING);
				WalletBaseService.loading = false;
				WalletBaseService.submitState = SubmitState.SIGN;
			});

			return;
		}

		if (this.walletTo?.id === 'gbm') {
			if (this.walletFrom?.id === 'pgn') {
				void this.polygonService
					.sendTransfer(this.walletFrom.walletId, this.walletTo.walletId, from.value)
					.then(res => {
						this.transferPgnToGbmRes = res;
						WalletBaseService.submitState = SubmitState.WITHDRAW;
						WalletBaseService.loading = false;

						void this.polygonService.getWalletData().toPromise().then(() => {});
						this.gbmService.getWalletData().subscribe(() => {
							WalletBaseService.logger('Balance for GBM has been updated', LOGGER_TYPES.INFO);
						});
					})
					.catch(() => {
						WalletBaseService.loading = false;
					});

				return;
			}

			if (this.walletFrom?.id === 'cnc') {
				void this.concordiumService
					.deposit(this.walletTo.walletId, this.walletFrom.walletId, from.value)
					.then(res => {
						this.transferCncToGbmRes = res;

						void this.concordiumService
							.getDepositParams(this.transferCncToGbmRes)
							.toPromise()
							.then(() => {
								this.concordiumService
									.concordiumDeposit(this.transferCncToGbmRes, this.walletTo.walletId)
									.toPromise()
									.then(() => {
										WalletBaseService.submitState = SubmitState.WITHDRAW;
										WalletBaseService.loading = false;

										void this.polygonService.getWalletData().toPromise().then(() => {});
										this.gbmService.getWalletData().subscribe(() => {
											WalletBaseService.logger('Balance for GBM has been updated', LOGGER_TYPES.INFO);
										});
									})
									.catch(() => {
										WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
										WalletBaseService.loading = false;
									});
							})
							.catch(() => {
								WalletBaseService.loading = false;
								WalletBaseService.logger('Error while checking deposit params', LOGGER_TYPES.ERROR);
							});
					})
					.catch(() => {
						WalletBaseService.logger('Error while withdraw', LOGGER_TYPES.ERROR);
						WalletBaseService.loading = false;
					});

				return;
			}
		}
	}

	public sign(): void {
		WalletBaseService.loading = true;
		const pass = this.formGroup.get('password');

		if (this.walletTo?.id === 'cnc') {
			this.gbmService.sign(pass?.value).subscribe(
				res => {
					this.transactionHash = res;
					WalletBaseService.xdr = '';
					WalletBaseService.loading = false;
					WalletBaseService.submitState = SubmitState.WITHDRAW;
					WalletBaseService.logger(LoggerDictionary.TRANSACTION_SIGNED, LOGGER_TYPES.SUCCESS);
					this.formGroup.controls.password.setValue('');
					this.gbmService.getWalletData().subscribe(() => {
						WalletBaseService.logger('Balance for GBM has been updated', LOGGER_TYPES.INFO);
					});
				},
				err => {
					WalletBaseService.loading = false;
				}
			);

			return;
		}

		if (this.walletTo?.id === 'pgn') {
			this.gbmService.sign(pass?.value).subscribe(
				res => {
					this.transactionHash = res;
					WalletBaseService.xdr = '';
					WalletBaseService.loading = false;
					WalletBaseService.submitState = SubmitState.WITHDRAW;
					WalletBaseService.logger(LoggerDictionary.TRANSACTION_SIGNED, LOGGER_TYPES.SUCCESS);
					this.formGroup.controls.password.setValue('');
					this.gbmService.getWalletData().subscribe(() => {
						WalletBaseService.logger('Balance for GBM has been updated', LOGGER_TYPES.INFO);
					});
				},
				err => {
					WalletBaseService.loading = false;
				}
			);

			return;
		}

		if (this.walletTo?.id === 'gbm') {
			if (this.walletFrom?.id === 'pgn') {
				this.polygonService.sign(pass?.value).subscribe(
					res => {
						this.transactionHash = res;
						WalletBaseService.xdr = '';
						WalletBaseService.loading = false;
						WalletBaseService.submitState = SubmitState.SEND_TRANSFER;
						WalletBaseService.logger(LoggerDictionary.TRANSACTION_SIGNED, LOGGER_TYPES.SUCCESS);
						this.formGroup.controls.password.setValue('');
					},
					err => {
						WalletBaseService.loading = false;
					}
				);

				return;
			}

			if (this.walletFrom?.id === 'cnc') {
				this.polygonService.sign(pass?.value).subscribe(
					res => {
						this.transactionHash = res;
						WalletBaseService.xdr = '';
						WalletBaseService.loading = false;
						WalletBaseService.submitState = SubmitState.SEND_TRANSFER;
						WalletBaseService.logger(LoggerDictionary.TRANSACTION_SIGNED, LOGGER_TYPES.SUCCESS);
						this.formGroup.controls.password.setValue('');
					},
					err => {
						WalletBaseService.loading = false;
					}
				);

				return;
			}
		}
	}

	public onRequestAssets(wallet: IWalletState): void {
		if (wallet.walletId.length < 3) {
			WalletBaseService.logger(LoggerDictionary.MISSING_SECOND_WALLET, LOGGER_TYPES.WARNING);
			return;
		}

		if (wallet.id === 'cnc') {
			WalletBaseService.logger(`Requesting assets for ${wallet.title}...`);
			this.concordiumService
				.requestAssets(wallet.walletId)
				.then(res => {
					if (res && res.success && !_.isEmpty(res.result)) {
						WalletBaseService.logger(`Assets request for ${wallet.title} succeeded`, LOGGER_TYPES.SUCCESS);
					} else {
						WalletBaseService.logger(`Requesting assets for ${wallet.title} failed`, LOGGER_TYPES.ERROR);
					}

					return;
				})
				.catch(() => {
					WalletBaseService.logger(`Requesting assets for ${wallet.title} failed`, LOGGER_TYPES.ERROR);
				});

			return;
		}

		if (wallet.id === 'pgn') {
			WalletBaseService.logger(`Requesting assets for ${wallet.title}...`);
			this.polygonService
				.requestAssets()
				.then(res => {
					if (res) {
						WalletBaseService.logger(`Assets request for ${wallet.title} succeeded`, LOGGER_TYPES.SUCCESS);
					} else {
						WalletBaseService.logger(`Requesting assets for ${wallet.title} failed`, LOGGER_TYPES.ERROR);
					}

					return;
				})
				.catch(() => {
					WalletBaseService.logger(`Requesting assets for ${wallet.title} failed`, LOGGER_TYPES.ERROR);
				});

			return;
		}
	}

	private setValidators(): void {
		const { from, to } = this.formGroup.controls;

		from.addValidators([Validators.required, Validators.maxLength(9)]);
		to.addValidators([Validators.required, Validators.maxLength(9)]);
	}

	private initForm(): void {
		this.setFormControls<BridgeBasicFormControls>({
			basicFormControls: BRIDGE_BASIC_FORM_CONTROLS
		});

		this.formGroup = this.getFormForModule();
		const { from, to } = this.formGroup.controls;
		from.valueChanges.subscribe(value => {
			if (value < 0) {
				from.patchValue(0, { emitEvent: false });
				to.patchValue(0, { emitEvent: false });
			} else {
				to.patchValue(Number(this.transformValue(value)).toFixed(7).toString(), { emitEvent: false });
			}

			to.markAsTouched();
		});

		to.valueChanges.subscribe(value => {
			if (value < 0) {
				from.patchValue(0, { emitEvent: false });
				to.patchValue(0, { emitEvent: false });
			} else {
				from.patchValue(Number(this.transformValue(value)).toFixed(7).toString(), { emitEvent: false });
			}
			from.markAsTouched();
		});
	}

	private transformValue(value: number): number {
		return value ? Number(this.decimalPipe.transform(value, '1.0-7').toString().split(',').join('')) : 0;
	}
}
