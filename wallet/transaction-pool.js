/**
 * Pending Transactions Pool
 */

const Transaction = require("./transaction");

class TransactionPool {

    constructor() {
        this.transactionMap = {};
    }

    //hard clear the whole transaction pool
    clear() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(transaction => transaction.input.address === inputAddress)
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        );
    }

    //clear confirmed transaction now in a block from the 
    //transaction pool
    clearBlockchainTransactions({ chain }) {

        //start at one to omit the genesis block
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            
            for (let transaction of block.data) {
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}


module.exports = TransactionPool;