const cryptoHash = require('./crypto-hash');


describe('cryptoHash()', () => {

    it('generates SHA-256 hash', () => {
        expect(cryptoHash('onion'))
            .toEqual('288971671685b8da56623362c82e1ead68186c5150a35e3b35b5ef74cd7ceebc')
    })

    it('produces the same hash with different order of the same input', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three', 'one', 'two'))
    })
})
