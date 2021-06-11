import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import {Client, Message} from "discord.js";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";

import PingCommand from "../../../src/commands/generic/PingCommand";
import Command from "../../../src/abstracts/BaseCommand";
import {client} from "../../../src";

describe("PingCommand", () => {
	describe("constructor", () => {
		it("creates a command called ping", () => {
			const command = new PingCommand();

			expect(command.getName()).to.equal("ping");
		});

		it("creates a command with correct description", () => {
			const command = new PingCommand();

			expect(command.getDescription()).to.equal("This command shows the ping latency");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			message = BaseMocks.getMessage();
			command = new PingCommand();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.execute(message, []);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states the amount of ping latency", async () => {
			const message = CustomMocks.getMessage();

			sandbox.createStubInstance(Client);

			sandbox.stub(client.ws, "ping").resolves(5);

			const messageMock = sandbox.stub(message.channel, "send");

			message.createdTimestamp = Date.now();

			await command.execute(message, []);

			expect(messageMock.firstCall.firstArg).to.equal("Pong! Latency is 0ms. API Latency is 5ms");
			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});