/**
 * Blockchain class
 * Links each block from Block Class to create a Blockchain
 */

const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    //use mineBlock from Block Class to create a new block
    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })

        //push the new block to end of the chain
        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;