/**
 * The Block Class
 * Generates and Mine new Blocks
 */

const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary')

class Block {
    //make the param an object to allow passing in the params 
    //in any order
    constructor({ timestamp, lastHash, hash, data, nounce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nounce = nounce;
        this.difficulty = difficulty;
    }

    static genesis() {
        //"this()" also mean the current class so can be written as
        //Block()
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {

        const lastHash = lastBlock.hash;

        let hash, timestamp;
        let { difficulty } = lastBlock;

        let nounce = 0;

        //block will only be mined when the difficulty is achieved
        do {
            //increase the nounce if current nounce didn't achieve
            //the difficulty
            nounce++;

            //so timestamp will be accurate, generae the timestamp 
            //when the difficulty is achieved
            timestamp = Date.now();

            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })

            hash = cryptoHash(timestamp, lastHash, data, nounce, difficulty)

        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nounce,
            hash
        })
    }

    //increases difficulty when block mine time is faster
    //than MINE_RATE and 
    //decreases difficulty when block mine time is slower
    //than MINE_RATE
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        if (difficulty < 1) {
            return 1;
        }

        const difference = timestamp - originalBlock.timestamp;

        if (difference > MINE_RATE) {
            return difficulty - 1;
        }

        return difficulty + 1;
    }
}

const block1 = new Block({
    timestamp: '01/01/01',
    lastHash: 'onion-lastHash',
    hash: 'onion-hash',
    data: 'onion-data'
});

// console.log('block1', block1);

module.exports = Block;