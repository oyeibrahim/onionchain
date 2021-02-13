const bodyParser = require('body-parser');
const express = require('express');

const axios = require('axios');

const Blockchain = require('./blockchain');
//pubsub
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');



const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;




app.use(bodyParser.json())

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    //redirect to /api/blocks
    res.redirect('blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    console.log('transaction', transactionPool);

    res.json({ type: 'success', transaction });
});



//SYNC any new node with root node
const syncChains = () => {
    axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`)
        .then(function (body) {
            const rootChain = body.data;

            console.log('replace chain on a sync with', rootChain);

            blockchain.replaceChain(rootChain);

        })
        .catch(function (e) {
            console.log("failed");
        });
}



let PEER_PORT;

//GENERATE_PEER_PORT is env variable set with cross-env
//if true. it means we want the new process to run on another port
//so generate a new port for the process
if (process.env.GENERATE_PEER_PORT === 'true') {
    //add random number from 1 to 999 to the DEFAULT_PORT to get
    //a different port
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`)

    //only do the initial blockchain sync if the process is not
    //the main blockchain
    if (PORT !== DEFAULT_PORT) {
        //start chain SYNC
        syncChains();
    }
})