export async function throwError(message, errorMessage) {
    let error = await message.reply(errorMessage);
    error.delete({timeout: 7500});
}
