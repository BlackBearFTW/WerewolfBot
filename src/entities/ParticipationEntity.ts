import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Lobby} from "./LobbyEntity";
import {User} from "./UserEntity";
import RolesEnum from "../types/enums/RolesEnum";

@Entity("participations")
export class Participation {
    @PrimaryGeneratedColumn("uuid")
    	id!: number;

    @ManyToOne(() => Lobby, lobby => lobby.participations, {cascade: false})
    @JoinColumn({ name: "lobby_id" })
    	lobby!: Lobby;

    @ManyToOne(() => User, user => user.participations)
    @JoinColumn({ name: "user_id" })
    	user!: User;

    @Column({name: "role_id", type: "enum", enum: RolesEnum, default: RolesEnum.TOWN_FOLK })
    	roleId!: RolesEnum;

    @Column()
    	leader!: boolean;

    @Column()
    	dead!: boolean;
}