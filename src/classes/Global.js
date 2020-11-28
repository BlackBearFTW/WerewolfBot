class Global {

    static async throwError(message, errorMessage = 'There was an error') {
        let error = await message.reply(errorMessage);
        await error.delete({ timeout: 7500 });
    }
}

module.exports = Global