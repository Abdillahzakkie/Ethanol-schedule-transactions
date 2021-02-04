const signMessageForm = document.querySelector('.message-sign-form');
const msgHashInput = document.querySelector('.msg-hash');
const messageSignature = document.querySelector('.signature');
const ethereum = window.ethereum;


// Contract 
let web3;
let user;

window.addEventListener('DOMContentLoaded', async () => {
  await connectDapp();
})

const connectDapp = async () => {
    await loadWeb3();
    // await loadBlockchainData();
}

const loadWeb3 = async () => {
    try {
        await ethereum.enable();
        if(!ethereum) return alert("Non-Ethereum browser detected. You should consider trying Metamask");
        web3 = new Web3(ethereum);
        // Get Network / chainId
        const _chainId = await ethereum.request({ method: 'eth_chainId' });
        if(parseInt(_chainId, 16) !== 1) return alert("Connect wallet to a main network");

        const _accounts = await ethereum.request({ method: 'eth_accounts' });
        [user] = _accounts;

    } catch (error) {
        console.log(error.message);
        return error.message;
    }       
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

signMessageForm.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const _user = web3.utils.toChecksumAddress(user);
        let _recipient = e.target.elements[0].value;
        let _ethValue = e.target.elements[1].value;
        let _gasPrice = e.target.elements[2].value;

        const _isAddress = web3.utils.isAddress(_recipient);
        if(!_isAddress) return alert("Invalid recipient");
        if(Number(_gasPrice) <= 0 || Number(_ethValue) <= 0) return;

        _recipient = web3.utils.toChecksumAddress(_recipient);
        _gasPrice = web3.utils.toWei(_gasPrice, "wei");

        const _rawTxn = {
            from: _user,
            to: _recipient,
            gas: '250000',
            gasPrice: _gasPrice,
            value: web3.utils.toWei(_ethValue, 'ether'),
            data: web3.utils.toHex("transfer(address recipient, uint256 amount)")
        }
        const _sigResponse = await web3.eth.signTransaction(_rawTxn);
        // messageSignature.textContent = `Signature: ${_signature}`;

        const response = await postData('http://127.0.0.1:8080/submit_txns', { ..._sigResponse, from: _user });
        return alert(`Transaction Id: ${response._id}`);
    } catch (error) {
        console.log(error.message);
        return
    }
})
