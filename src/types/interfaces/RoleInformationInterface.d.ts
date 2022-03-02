import RolesEnum from "../enums/RolesEnum";

interface IRoleInfo {
    id: RolesEnum,
    name: string,
    description: string,
    emote: string,
}

export default IRoleInfo;