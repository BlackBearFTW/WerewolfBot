import IRoleInfo from "./RoleInformationInterface";

interface IRole {
    startTurn(): void;
    endTurn(): void;
    getInfo(): IRoleInfo;
}

export default IRole;