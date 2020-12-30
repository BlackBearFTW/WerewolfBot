export const event = {
    name: 'message',
    once: false,
    disabled: true,
    async execute(message) {
        if (message.author.bot)
            return;
        await message.channel.send(`${message.author} has spoken!`);
    }
};
