import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Participation} from "./ParticipationEntity";
import {v4 as uuid} from "uuid";

@Entity("lobbies")
export class Lobby {
    @PrimaryGeneratedColumn("uuid")
    	id!: number;

    @Column({name: "invite_code", unique: true})
    	inviteCode: string = uuid().substr(-6).toUpperCase();

    @Column({name: "guild_id"})
    	guildId!: string;

    @Column({name: "category_id"})
    	categoryId!: string;

    @Column({name: "has_active_game", default: false})
    	hasActiveGame!: boolean;

    @OneToMany(
    	() => Participation,
    	participation => participation.lobby,
    	{cascade: true})
    	participations!: Participation[];
}