const bodyParser = require('body-parser');
const express = require('express');

const axios = require('axios');
// axios.get(url)
// .then(function (body) {
//     //get only the data since axios return all sorts of things
//     res.send(body.data);
// })
// .catch(function (e) {
//     res.send("failed");
// });
// (async function () {
// })();

const Blockchain = require('./blockchain');
//pubsub
const PubSub = require('./app/pubsub');


const app = express();
const blockchain = new Blockchain();
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
    if(PORT !== DEFAULT_PORT){
        //start chain SYNC
        syncChains();
    }
})