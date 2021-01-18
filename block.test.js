const Block = require('./block');
const { GENESIS_DATA } = require('./config');

//test block
describe('Block', () => {

    const timestamp = 'a-date';
    const lastHash = 'onion-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];

    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data
    });

    it('has a timestamp', () => {
        expect(block.timestamp).toEqual(timestamp);
    });
    it('has a lastHash', () => {
        expect(block.lastHash).toEqual(lastHash);
    });
    it('has a hash', () => {
        expect(block.hash).toEqual(hash);
    });
    it('has a data', () => {
        expect(block.data).toEqual(data);
    });

    //Test genesis
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        });
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    //test mined block
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data })

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true)
        });
        it('sets the `lastHash` to be the `hash` of teh lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });
        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });
    });

})
