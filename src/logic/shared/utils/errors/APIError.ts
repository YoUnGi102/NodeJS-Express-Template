export interface StatusMessage {
	status: number;
	message: string;
	title: string;
}

export class APIError extends Error {
	public status: number;
	public title?: string;

	constructor(
		status = 500,
		message = "Internal Server Error",
		title = "INTERNAL_SERVER_ERROR",
	) {
		super(message);
		this.name = "APIError";
		this.status = status;
		this.title = title;

		Object.setPrototypeOf(this, APIError.prototype);
	}
}
