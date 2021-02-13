//grab transaction from pool and mine in a block


class TransactionMiner {

    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransaction() {

        //get valid transactions from pool

        //generate miner's reward

        //add a block consisting of these transactions to the blockchain

        //broadcast the updated blockchain

        //clear the pool

    }
}


module.exports = TransactionMiner;