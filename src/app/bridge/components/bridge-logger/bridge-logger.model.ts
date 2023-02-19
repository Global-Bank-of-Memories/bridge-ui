export interface ILog {
	id: string;
	data: string;
	createdDate: Date;
	updatedDate: Date;
}

export enum LoggerType {
	DEFAULT = 'default',
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	SUCCESS = 'success'
}

export enum LoggerColor {
	default = 'log-default',
	info = 'log-info',
	warning = 'log-warning',
	error = 'log-error',
	success = 'log-success'
}

export const LOG_LIMIT = 10000;
