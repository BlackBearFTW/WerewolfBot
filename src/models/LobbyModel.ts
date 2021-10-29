import {Column, CreateDateColumn, Entity, getConnection, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParticipationModel} from "./ParticipationModel";
import {v4 as uuid} from "uuid";
import {CategoryChannel, ColorResolvable, Guild, MessageEmbed, TextChannel, User} from "discord.js";
import { embedColors } from "../config.json";
import DiscordUtil from "../utils/DiscordUtil";
import {UserModel} from "./UserModel";
import NotificationUtil from "../utils/NotificationUtil";

@Entity("lobbies")
export class LobbyModel {
    @PrimaryGeneratedColumn()
    	id!: number;

    @Column({name: "invite_code", unique: true, default: uuid().substr(-6).toUpperCase()})
    	inviteCode!: string;

    @Column({name: "guild_id"})
    	guildId!: string;

    @Column({name: "category_id"})
    	categoryId!: string;

    @Column({name: "has_active_game", default: false})
    	hasActiveGame!: boolean;

    @CreateDateColumn({name: "created_at"})
    	createdAt!: Date;

    @OneToMany(() => ParticipationModel, participation => participation.userId, {onUpdate: "CASCADE", onDelete: "CASCADE"})
    	participations!: ParticipationModel[];

    private guild!: Guild;
    private category!: CategoryChannel;

    // Two states:
    // - First initialization
    // - After being stored in database

    /*
	First initialization
	- create instance
	- generate invite code
	- run createDiscordStructure
	- run sendInformationEmbeds
	- add user who created instance as participant
	 */

    /*
	After being stored in database:
	- find database record with provided lobby id
	- get guild and category from discord client
	- manipulate fields or delete structure or add participant
	 */

    /**
     * Creates the category and channels inside Discord that will be used for the lobby
     */
    public async createDiscordStructure(): Promise<void> {
	    this.category = await this.guild.channels.create(`WEREWOLF LOBBY: ${this.inviteCode}`, {
		    type: "GUILD_CATEGORY",
		    permissionOverwrites: [{
			    id: this.guildId,
			    deny: ["VIEW_CHANNEL"]
		    }]
	    });

    	await this.guild.channels.create("📖｜information", {
    		parent: this.categoryId,
    		type: "GUILD_TEXT",
    		permissionOverwrites: [{
    			id: this.guildId,
    			deny: ["SEND_MESSAGES"]
    		}]
    	});

    	await this.guild.channels.create("💬｜main", {
    		parent: this.category,
    		type: "GUILD_TEXT"
    	});

    	await this.guild.channels.create("🎲｜moves", {
    		parent: this.category,
    		type: "GUILD_TEXT",
    		permissionOverwrites: [{
    			id: this.guildId,
    			deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
    		}]
    	});

    	await this.guild.channels.create("🎤｜voice", {
    		parent: this.category,
    		type: "GUILD_VOICE"
    	});

    	this.categoryId = this.category.id;
    }

    /**
     * Sends all the instructions and information to the lobby
     */
    public async sendInformationEmbeds() {
    	const informationChannel = this.category.children.first()! as TextChannel;

    	const inviteCodeEmbed = new MessageEmbed({
    		title: "Invite Code",
    		description: `Use Code \`${this.inviteCode}\` To Join This Lobby.`,
    		color: embedColors.neutralColor as ColorResolvable
    	});

    	await informationChannel.send({
    		embeds: [inviteCodeEmbed]
    	});
    }

    /**
     * Deletes the category and channels inside Discord that will be used for the lobby
     */
    public async deleteDiscordStructure(): Promise<void> {
    	this.category.children.map(async channel => await channel.delete());
    	await this.category.delete();
    }

    /**
     * Adds a user to this lobby
     * @param user: the UserModel of the user that needs to be added
     * @param makeLobbyLeader: if the participant should be the lobbyLeader
     */
    public async addParticipant(user: UserModel, makeLobbyLeader: boolean) {
    	const participationRepository = getConnection().getRepository(ParticipationModel);

    	const participationModel = new ParticipationModel();

    	participationModel.lobbyId = this;

    	participationModel.userId = user;

    	participationModel.leader = makeLobbyLeader;

	    await participationRepository.save(participationModel);
    }

    /**
	 * Removes a user from this lobby
	 * @param user: the UserModel of the user that needs to be removed
	 */
    public async removeParticipant(user: UserModel) {
	    const participationRepository = getConnection().getRepository(ParticipationModel);

    	const participationModel = await participationRepository.findOneOrFail({where: {
    		lobbyId: this,
    		userId: user
    	}});

	    if (!participationModel) throw new Error("This user is not a participant of this lobby");

    	// TODO: Make this send a message to the channel where the command was called from that they need to transfer leadership
    	// If (participationModel.leader) return NotificationUtil.sendErrorEmbed();
	    if (participationModel.leader) throw new Error("User needs to transfer leadership before leaving");

    	await participationRepository.remove(participationModel);
    }

    /**
	 * Changes the leader of this lobby
	 * @param user: the user that should become the new leader
	 */
    public async changeLeader(user: UserModel) {
	    const participationRepository = getConnection().getRepository(ParticipationModel);

    	await participationRepository.update({lobbyId: this, leader: true}, {leader: false});
    	await participationRepository.update({lobbyId: this, userId: user}, {leader: true});
    }

	// StartGame
}