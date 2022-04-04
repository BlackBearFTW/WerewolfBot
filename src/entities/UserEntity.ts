import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Participation} from "./ParticipationEntity";

@Entity("users")
export class User {
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

    @OneToMany(() => Participation, participation => participation.user, {onUpdate: "CASCADE", onDelete: "CASCADE"})
    	participations!: Participation[];
}