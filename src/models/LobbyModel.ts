import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParticipationModel} from "./ParticipationModel";
import {v4 as uuid} from "uuid";
import {CategoryChannel, ColorResolvable, Guild, MessageEmbed, TextChannel} from "discord.js";
import { embedColors } from "../config.json";

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

    constructor(guild: Guild) {
    	this.guildId = guild.id;
    	this.guild = guild;
    }

    /**
     * Creates the category and channels inside Discord that will be used for the lobby
     */
    public async createDiscordStructure(): Promise<void> {
    	this.category = await this.guild.channels.create(`WEREWOLF LOBBY: ${this.inviteCode}`, {
    		type: "GUILD_CATEGORY",
    		permissionOverwrites: [{
    			id: this.guild.roles.everyone.id,
    			deny: ["VIEW_CHANNEL"]
    		}]
    	});

    	await this.guild.channels.create("📖｜information", {
    		parent: this.category,
    		type: "GUILD_TEXT",
    		permissionOverwrites: [{
    			id: this.guild.roles.everyone.id,
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
    			id: this.guild.roles.everyone.id,
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
}