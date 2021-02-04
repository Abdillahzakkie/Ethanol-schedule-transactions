const loadWeb3 = require('./web3');
const Post = require('../models/posts');

let web3;

const loadBlockchainData = async () => {
    try {
        web3 = await loadWeb3();

        setInterval(async () => {
            await loadAllUnFilledTransactions();
        }, 10000);

    } catch (error) {
        console.log(error);
        return error;
    }
}

const loadAllUnFilledTransactions = async () => {
    try {
        let _curentGasPrice = await web3.eth.getGasPrice();
        _curentGasPrice = web3.utils.fromWei(_curentGasPrice, 'gwei');
        const _max = Number(_curentGasPrice) + 5;

        let result = await Post.find({ filled: false });
        result = result.filter(item => {
            return Number(web3.utils.fromWei(JSON.stringify(item.gasPrice), 'gwei')) <= _max
        });
        console.log("result", result);

        // for(let i = 0; i < result.length; i++) {
        //     if(result.length === 0) return;
        //     const { signature } = result[i];
        //     web3.eth.sendSignedTransaction(signature).on('reciept', console.log);
        // }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { loadBlockchainData, web3 }