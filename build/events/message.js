export const event = {
    name: 'message',
    once: false,
    async execute(message) {
        if (message.author.bot)
            return;
        await message.channel.send(`${message.author} has spoken!`);
    }
};
