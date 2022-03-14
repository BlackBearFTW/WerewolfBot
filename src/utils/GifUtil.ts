import GIFEncoder from "gifencoder";
import { createCanvas } from "canvas";

class GifUtil {
	public static generateGif() {
		const encoder = new GIFEncoder(200, 200);

		encoder.start();
		encoder.setRepeat(-1); // 0 for repeat, -1 for no-repeat
		encoder.setDelay(1000); // Frame delay in ms
		encoder.setQuality(10); // Image quality. 10 is default.

		// Use node-canvas
		const canvas = createCanvas(200, 200);
		const ctx = canvas.getContext("2d");

		// Text
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		// eslint-disable-next-line func-style
		const fillBackground = (bgColor: string) => {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		// Background
		fillBackground("#2f3136");
		encoder.addFrame(ctx);

		ctx.fillStyle = "#ffffff";
		ctx.font = "72px Arial";

		for (let i = 30; i > 1; i--) {
			fillBackground("#2f3136");
			ctx.fillStyle = "#ffffff";
			ctx.fillText(`${i}`, canvas.width / 2, canvas.height / 2);
			encoder.addFrame(ctx);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		encoder.finish();

		// Const buffer = encoder.out.getData();

		// Console.log(encoder.out);

		// Return `data:image/gif;base64,${buffer.toString("base64")}`;
		return encoder.out.getData();
	}
}

export default GifUtil;