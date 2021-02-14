/**
 * Blockchain class
 * Links each block from Block Class to create a Blockchain
 */

const Block = require('./block');
const Transaction = require('../wallet/transaction');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Wallet = require('../wallet');

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
    replaceChain(chain, onSucess) {

        //new chain MUST be longer than prev chain
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        if (onSucess) {
            onSucess();
        }
        //if all above pass, then replace the chain
        console.log('replacing chain with', chain)
        this.chain = chain;
    }

    //check if data in the chain is valid
    validTransactionData({ chain }) {
        for (let i = 0; i < chain.length; i++) {
            const block = chain[i];

            //to keep track so no duplicate transaction in a block
            //Set() is a native JavaScript class that allows a set 
            //of Unique items only unlike Array that can have non-unique
            //items
            const transactionSet = new Set();

            let rewardTransactionCount = 0;

            for (const transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exeed limit');
                        return false;
                    }

                    //using Object.values to grab first transaction since 
                    //we can't know the publicKey beforehand
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid Transaction');
                        return false;
                    }

                    //make sure amount of the addresses is balance from
                    //the existing accepted chain hence use of this.chain
                    //and not @param chain.
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error('Invalid input amount');
                        return false;
                    }

                    //check to ensure no duplicate transaction in the block
                    //if it exist, return false
                    //if it doesn't exist before then add it to the Set()
                    if (transactionSet.has(transaction)) {
                        console.error('An identical transaction appears more than once in the block');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }

                }
            }
        }

        return true;
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