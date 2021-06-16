class DateUtil {
	static async sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

export default DateUtil;