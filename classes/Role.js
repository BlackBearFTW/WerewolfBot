class Role {

    static async getRoles() {
        let [results] = await link.execute(`SELECT NAME, DESCRIPTION, EMOTE, POSITION FROM roles`);
        return results;
    }
}

module.exports = Role