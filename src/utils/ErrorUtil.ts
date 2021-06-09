class ErrorUtil {
	static async handle(fn: Function) {
		try {
			const result = await fn();

			return [result, null];
		} catch (error) {
			console.log(error);
			return [null, error];
		}
	}
}

export default ErrorUtil;