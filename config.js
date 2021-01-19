
//time for mining new block 
const MINE_RATE = 1000; //in millisecond (1000 = 1s)

const INITIAL_DIFFICULTY = 1;

const GENESIS_DATA = {
    timestamp: Date.now(),
    lastHash: 'NONE',
    hash: 'GENESIS-BLOCK',
    difficulty: INITIAL_DIFFICULTY,
    nounce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE }