const Web3 = require('web3');
require('dotenv/config');


let web3;

const connectWeb3 = async () => {
    web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.Api_Key}`);
    return web3;
}

module.exports = connectWeb3;