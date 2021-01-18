const { GENESIS_DATA } = require('./config');

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
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data
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