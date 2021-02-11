const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');
const hexToBinary = require('hex-to-binary')

//test block
describe('Block', () => {

    const timestamp = 2000;
    const lastHash = 'onion-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nounce = 1;
    const difficulty = 1;

    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nounce,
        difficulty
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
    it('has a nounce', () => {
        expect(block.nounce).toEqual(nounce);
    });
    it('has a difficulty', () => {
        expect(block.difficulty).toEqual(difficulty);
    });

    //Test genesis
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        // console.log('genesisBlock', genesisBlock);

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

        it('gives SHA-256 based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.timestamp,
                        minedBlock.nounce,
                        minedBlock.difficulty,
                        lastBlock.hash,
                        data
                    )
                );
        });

        //test the mined block hash matches the difficulty
        //repeat(n) creates the string n times
        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
            expect(possibleResults.includes(minedBlock.difficulty))
                .toBe(true);
        });

    });

    //test is difficulty is raised when block mine time is faster
    //than MINE_RATE and 
    //difficulty is reduced when block mine time is slower
    //than MINE_RATE
    describe('adjust difficulty', () => {

        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        })

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        })

        //test that difficulty can't go below 1
        it('has a lower limit of 1', () => {
            block.difficulty = -1
            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        })

    })


})
