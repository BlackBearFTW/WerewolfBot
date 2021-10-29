import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {ParticipationModel} from "./ParticipationModel";

@Entity("users")
export class UserModel {
	@PrimaryColumn()
		id!: string;

	@Column()
		wins!: number;

	@Column()
		losses!: number;

	@Column()
		deaths!: number;

	@Column({name: "played_as_werewolf"})
		playedAsWerewolf!: number;

	@OneToMany(() => ParticipationModel, participation => participation.user, {onUpdate: "CASCADE", onDelete: "CASCADE"})
		participations!: ParticipationModel[];
}