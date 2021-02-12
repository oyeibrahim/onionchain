const cryptoHash = require('./crypto-hash');


describe('cryptoHash()', () => {

    it('generates SHA-256 hash', () => {
        expect(cryptoHash('onion'))
            .toEqual('0937ce7e31a1da5a6765a008a54163ade6308de7a793be7a3b26d8af226dbef7')
    })

    it('produces the same hash with different order of the same input', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three', 'one', 'two'))
    })

    it('produces a unique hash when the properties have changed on an input', () => {
        const onion = {};
        const originalHash = cryptoHash(onion);

        onion['a'] = 'a';

        expect(cryptoHash(onion)).not.toEqual(originalHash)
    })
})
