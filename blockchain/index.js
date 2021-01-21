/**
 * Blockchain class
 * Links each block from Block Class to create a Blockchain
 */

const Block = require('./block');
const cryptoHash = require('../util/crypto-hash');

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

    //for chain replacement
    replaceChain(chain) {

        //new chain MUST be longer than prev chain
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        //if all above pass, then replace the chain
        console.log('replacing chain with', chain)
        this.chain = chain;
    }

    //check if a chain is valid
    static isValidChain(chain) {
        
        //check genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        
        
        //check data and hash
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nounce, difficulty, data } = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nounce, difficulty);

            if (hash !== validatedHash) return false;

            //Math.abs ensures it can't go in both positive and negative direction
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }
}

module.exports = Blockchain;