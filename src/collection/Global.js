class Global {

    static async throwError(message, errorMessage) {
        let error = await message.reply(errorMessage);
        error.delete({ timeout: 7500 });
    }
}

module.exports = Global