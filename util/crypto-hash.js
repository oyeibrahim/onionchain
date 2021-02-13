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
    //use Array.map to stringify so that if incoming input is a
    //Javascript object, it won't be treated as such since we 
    //need to update some hash like transaction update and object
    //won't get updated, but a stringified data will get updated
    hash.update(inputs.map(input => JSON.stringify(input)).sort().toString());

    return hash.digest('hex');
}

module.exports = cryptoHash;