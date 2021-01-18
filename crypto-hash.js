/**
 * Generates SHA-256 hash
 */

//internal function
const crypto = require('crypto')

//using spread operator to get any number of param and not 
//specify the number of param this function can take explicitly
const cryptoHash = (...inputs) => {

    const hash = crypto.createHash('sha256');

    //sort to make any order of input params return same hash
    //convert the string
    hash.update(inputs.sort().toString());

    return hash.digest('hex');
}

module.exports = cryptoHash;