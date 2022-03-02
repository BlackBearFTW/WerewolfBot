import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {LobbyModel} from "./LobbyModel";
import {UserModel} from "./UserModel";
import RolesEnum from "../types/enums/RolesEnum";

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

    @Column({name: "role_id", enum: RolesEnum, default: RolesEnum.TOWN_FOLK })
    	roleId!: RolesEnum;

    @Column()
    	leader!: boolean;

    @Column()
    	dead!: boolean;
}