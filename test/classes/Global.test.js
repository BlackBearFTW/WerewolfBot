const {BaseMocks, CustomMocks } = require('@lambocreeper/mock-discord.js');
const Global = require('../../src/classes/Global');

describe('Global class', () => {
    it('throwError method', async() => {
        await expect(Global.throwError(BaseMocks.getMessage(), 'Error message')).resolves.not.toThrow();
    });
});