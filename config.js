
//time for mining new block 
const MINE_RATE = 1000; //in millisecond (1000 = 1s)

const INITIAL_DIFFICULTY = 1;

const GENESIS_DATA = {
    timestamp: 1600,
    lastHash: 'NONE',
    hash: 'GENESIS-BLOCK',
    difficulty: INITIAL_DIFFICULTY,
    nounce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorised-reward*' };

const MINING_REWARD = 50;

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
}