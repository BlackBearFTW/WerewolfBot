class Global {

    static async throwError(message, errorMessage) {
        let error = await message.channel.reply(errorMessage);
        error.delete({ timeout: 5000 });
    }
}

module.exports = Global