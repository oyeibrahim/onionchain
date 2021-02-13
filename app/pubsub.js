/**
 * Publish and Subscribe using Redis
 */

const redis = require('redis');


const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message)
        })
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}, Message: ${message}`);

        //Update chain when new chain received on the BLOCKCHAIN Channel
        //convert thr incoming string message to JSON
        const parsedMessage = JSON.parse(message);

        switch (channel) {
            //if new message on the Blockchain then call replaceChain
            //to deal with it
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage);
                break;

            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;

            default:
                return;
        }

    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        //to avoid sending message to self, first unsubscribe when
        //you want to send a message then re-subscribe after the 
        //message has been sent
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    //to broadcast the node's chain
    //convert the chain to string - only string can be sent 
    //in publish
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    //to broadcast transaction pool
    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}


module.exports = PubSub;

//TEST
// const testPubSub = new PubSub();

// setTimeout(() => {
//     testPubSub.publisher.publish(CHANNELS.TEST, 'onion');
// }, 1000);