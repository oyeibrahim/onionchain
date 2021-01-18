/**
 * The Block Class
 * Generates and Mine new Blocks
 */

const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    //make the param an object to allow passing in the params 
    //in any order
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        //"this()" also mean the current class so can be written as
        //Block()
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {

        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        })
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