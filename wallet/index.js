/**
 * Wallet
 */

const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        //hash the data before signing
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }

        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }
        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        //keeps track of if the wallet has conducted a transaction 
        //in which case the calculation starts from the last transaction
        let hasConductedTransaction = false;

        let outputsTotal = 0;

        //ends at 1 to omit genesis block
        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }
                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputsTotal = outputsTotal + addressOutput;
                }
            }

            if (hasConductedTransaction) {
                break;
            }

        }

        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;

    }

}

module.exports = Wallet;