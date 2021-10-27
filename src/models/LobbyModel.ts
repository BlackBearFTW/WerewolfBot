import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParticipationModel} from "./ParticipationModel";

@Entity("lobbies")
export class LobbyModel {
    @PrimaryGeneratedColumn()
    	id!: number;

    @Column({name: "invite_code"})
    	inviteCode!: string;

    @Column()
    	guild!: string;

    @Column()
    	category!: string;

    @Column({name: "has_started"})
    	hasStarted!: boolean;

    @CreateDateColumn({name: "created_at"})
    	createdAt!: Date;

    @OneToMany(() => ParticipationModel, participation => participation.userId, {onUpdate: "CASCADE", onDelete: "CASCADE"})
    	participations!: ParticipationModel[];
}