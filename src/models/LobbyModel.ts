import {Column, CreateDateColumn, Entity, getConnection, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParticipationModel} from "./ParticipationModel";
import {v4 as uuid} from "uuid";

@Entity("lobbies")
export class LobbyModel {
    @PrimaryGeneratedColumn()
    	id!: number;

    @Column({name: "invite_code", unique: true})
    	inviteCode: string = uuid().substr(-6).toUpperCase();

    @Column({name: "guild_id"})
    	guildId!: string;

    @Column({name: "category_id"})
    	categoryId!: string;

    @Column({name: "has_active_game", default: false})
    	hasActiveGame!: boolean;

    @CreateDateColumn({name: "created_at"})
    	createdAt!: Date;

    @OneToMany(() => ParticipationModel, participation => participation.user, {onUpdate: "CASCADE", onDelete: "CASCADE"})
    	participations!: ParticipationModel[];

	// REPLACE WITH FACTORY

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
	/*    Public async createDiscordStructure(guild: Guild): Promise<void> {
    	const guild = guild;
    	this.guildId = guild.id;

	    this.category = await guild.channels.create(`WEREWOLF LOBBY: ${this.inviteCode}`, {
		    type: "GUILD_CATEGORY",
		    permissionOverwrites: [{
			    id: this.guildId,
			    deny: ["VIEW_CHANNEL"]
		    }]
	    });

    	await this.guild.channels.create("📖｜information", {
    		parent: this.category,
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

    /!**
     * Sends all the instructions and information to the lobby
     *!/
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

    /!**
     * Deletes the category and channels inside Discord that will be used for the lobby
     *!/
    public async deleteDiscordStructure(): Promise<void> {
    	await this.getGuildAndCategoryFromDiscord();

    	this.category.children.map(async channel => await channel.delete());
    	await this.category.delete();
    }

    /!**
     * Adds a user to this lobby
     * @param user: the UserModel of the user that needs to be added
     * @param makeLobbyLeader: if the participant should be the lobbyLeader
     *!/
    public async addParticipant(user: UserModel, makeLobbyLeader: boolean = false): Promise<boolean> {
    	const participationRepository = getConnection().getRepository(ParticipationModel);

    	await this.getGuildAndCategoryFromDiscord();

    	const [, count] = await participationRepository.findAndCount({where: {
    		user: user,
    		lobby: this
    	}});

    	if (count > 0) return false;

    	const participationModel = new ParticipationModel();

    	participationModel.lobby = this;

    	participationModel.user = user;

    	participationModel.leader = makeLobbyLeader;

	    await participationRepository.save(participationModel);

	    await this.category.permissionOverwrites.create(user.id, {
    		VIEW_CHANNEL: true
	    });

    	return true;
    }

    /!**
	 * Removes a user from this lobby
	 * @param user: the UserModel of the user that needs to be removed
	 *!/
    public async removeParticipant(user: UserModel) {
	    const participationRepository = getConnection().getRepository(ParticipationModel);

    	await this.getGuildAndCategoryFromDiscord();

    	const participationModel = await participationRepository.findOneOrFail({where: {
    		lobby: this,
    		user: user
    	}});

	    if (!participationModel) throw new Error("This user is not a participant of this lobby");

    	// TODO: Make this send a message to the channel where the command was called from that they need to transfer leadership
    	// If (participationModel.leader) return NotificationUtil.sendErrorEmbed();
	    if (participationModel.leader) throw new Error("User needs to transfer leadership before leaving");

    	await participationRepository.remove(participationModel);

    	await this.category.permissionOverwrites.delete(user.id);
    }

    /!**
	 * Changes the leader of this lobby
	 * @param user: the user that should become the new leader
	 *!/
    public async changeLeader(user: UserModel) {
	    const participationRepository = getConnection().getRepository(ParticipationModel);

    	await participationRepository.update({lobby: this, leader: true}, {leader: false});
    	await participationRepository.update({lobby: this, user: user}, {leader: true});
    }

    public async getGuildAndCategoryFromDiscord() {
    	if (!this.guildId || !this.categoryId) return;

    	const client = DiscordUtil.getClient();

    	const guild = await client.guilds.cache.get(this.guildId)!;
    	const category = client.channels.cache.get(this.categoryId) as CategoryChannel;

    	return [guild, category];
    }*/

	// StartGame
}