export interface MatchesTable {
    MATCH_ID?: number;
    GUILD_ID?: string;
    CATEGORY_ID?: string;
    STARTED?: string;
    CREATION_DATE?: string;
}

export interface MatchesUsersTable {
    MATCH_ID?: number;
    USER_ID?: string;
    ROLE_ID?: number;
    LEADER?: number;
}

export interface UsersTable {
    USER_ID?: string;
    WIN_COUNT?: number;
    LOSE_COUNT: number;
    DEATH_COUNT?: number;
}

export interface RolesTable {
    ROLE_ID?: number;
    NAME?: string;
    DESCRIPTION?: string;
    EMOTE?: string;
    POSITION?: number;
}
