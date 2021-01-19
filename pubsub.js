/**
 * Publish and Subscribe using Redis
 */

const redis = require('redis');


const CHANNELS = {
    TEST: 'TEST'
}

class PubSub {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNELS.TEST);

        this.subscriber.on('message', (channel, message) => {
            this.handelMessage(channel, message)
        })
    }

    handelMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}, Message: ${message}`);
    }
}


const testPubSub = new PubSub();

setTimeout(() => {
    testPubSub.publisher.publish(CHANNELS.TEST, 'onion');
}, 1000);