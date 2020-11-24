const {BaseMocks, CustomMocks } = require('@lambocreeper/mock-discord.js');
const Global = require('../../src/classes/Global');

describe('Global class', function() {
    it('throwError method', function() {
        // expect(Global.throwError(BaseMocks.getMessage(), 'Error message')).toBe(true);
        expect(Global.throwError(1, 1)).toBe(2)
    });
});