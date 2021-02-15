const bodyParser = require('body-parser');
const express = require('express');

const axios = require('axios');

//built-in //for getting the absolute path as used in
//res.sendFile
const path = require('path');

const Blockchain = require('./blockchain');
//pubsub
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');



const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;



//for accepting request parameters
app.use(bodyParser.json())
//for serving any files (html, css e.tc) in the stated  
//direcory since we are using res.sendFile for client
app.use(express.static(path.join(__dirname, 'client/dist')));


//#-----------Block List-----------#//
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

//#-----------Test Mine Block-----------#//
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    //redirect to /api/blocks
    res.redirect('blocks');
});

//#-----------Create New Transaction-----------#//
app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({
                recipient,
                amount,
                chain: blockchain.chain
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

//#-----------Transaction Pool Map-----------#//
app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

//#-----------Mine Transactions-----------#//
app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransaction();

    //redirect to /api/blocks
    res.redirect('blocks');
});

//#-----------Wallet Info-----------#//
app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});


//################################
//CLIENT
//################################

// * means serve this when request is received for any 
//endpoint that hasn't been defined before
app.get('*', (req, res) => {
    //__dirname is current directory path, built-in
    //use path to get the absolute path since res.sendFile
    //require an absolute path
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

//################################



//SYNC any new node with root node
const syncWithRootState = () => {
    //sync blocks
    axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`)
        .then(function (body) {
            const rootChain = body.data;

            console.log('replace chain on a sync with', rootChain);

            blockchain.replaceChain(rootChain);

        })
        .catch(function (e) {
            console.log("failed");
        });

    //sync trannsaction pool
    axios.get(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`)
        .then(function (body) {
            const rootTransactionPoolMap = body.data;

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);

            transactionPool.setMap(rootTransactionPoolMap);

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
        syncWithRootState();
    }
})