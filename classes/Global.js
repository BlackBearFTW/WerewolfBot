class Global {

    static async throwError(message, errorMessage) {
        let error = await message.reply(errorMessage);
        error.delete({ timeout: 5000 });
    }
}

module.exports = Global