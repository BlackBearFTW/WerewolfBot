interface IRole {
    onTurn: () => void;
    onDeath: () => void;
    onTurnEnd: () => void;
}

export default IRole;