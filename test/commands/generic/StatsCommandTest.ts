import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import {Message} from "discord.js";
import {CustomMocks} from "@lambocreeper/mock-discord.js";

import StatsCommand from "../../../src/commands/generic/StatsCommand";
import Command from "../../../src/abstracts/BaseCommand";
import UserRepository from "../../../src/repositories/UserRepository";
import { embedColors } from "../../../src/config.json";
import NotificationUtil from "../../../src/utils/NotificationUtil";

describe("StatsCommand", () => {
	describe("constructor", () => {
		it("creates a command called stats", () => {
			const command = new StatsCommand();

			expect(command.getName()).to.equal("stats");
		});

		it("creates a command with correct description", () => {
			const command = new StatsCommand();

			expect(command.getDescription()).to.equal("Shows the stats about a user");
		});
	});

	describe("execute()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			message = CustomMocks.getMessage();
			command = new StatsCommand();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(UserRepository.prototype, "getById").resolves(null);

			await command.execute(message, []);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends an error message when user is not found", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(UserRepository.prototype, "getById").resolves(null);
			sandbox.stub(message.channel, "send").resolves(CustomMocks.getMessage());

			await command.execute(message, []);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("This user hasn't been found on this plane of existence.");
			expect(embed.hexColor).to.equal(embedColors.errorColor.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});