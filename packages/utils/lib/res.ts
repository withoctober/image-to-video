export interface Response<T> {
	code: number;
	message: string;
	data: T;
}

export function Response<T>(
	code: number,
	message: string,
	data: T,
): Response<T> {
	return {
		code,
		message,
		data,
	};
}

export function BadRequestResponse<T>(message: string): Response<T> {
	return Response(400, message, "" as T);
}

export function ServerErrorResponse<T>(message: string): Response<T> {
	return Response(500, message, "" as T);
}

export function SuccessResponse<T>(data: T): Response<T> {
	return Response(200, "success", data);
}

export interface BizException extends Error {
	code: number;
	message: string;
}

export function BizException(code: number, message: string): BizException {
	return {
		code,
		message,
		name: "BizException",
		stack: new Error().stack,
	};
}
