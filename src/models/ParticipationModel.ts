import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {LobbyModel} from "./LobbyModel";
import {UserModel} from "./UserModel";

@Entity("participations")
export class ParticipationModel {
    @PrimaryGeneratedColumn()
    	id!: number;

    @ManyToOne(() => LobbyModel, lobby => lobby.participations)
    @JoinColumn({ name: "lobby_id" })
    	lobby!: LobbyModel;

    @ManyToOne(() => UserModel, user => user.participations)
    @JoinColumn({ name: "user_id" })
    	user!: UserModel;

    @Column({name: "role_id" })
    	roleId!: number;

    @Column()
    	leader!: boolean;

    @Column()
    	dead!: boolean;
}