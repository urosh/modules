let keythereum = require('keythereum');
let fs = require('fs');
require('dotenv').config({ silent: true });
const ethereumjsWallet = require('ethereumjs-wallet');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')
const axios = require('axios')

var wstream = fs.createWriteStream('./mykey.txt');
let privateKeyTxt = '4cd42191bd63b533005b1e969f842d82861482c02706bcb0858e4e2d5ec3aade';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount = process.env.ACCOUNT_ADDRESS;

const amountToSend = 0.00100000;


const getCurrentGasPrices = () => {
 return  axios.get('https://ethgasstation.info/json/ethgasAPI.json')
}


const main = (privateKey) => {
  try{

    //let myBalanceWei = web3.eth.getBalance(web3.eth.defaultAccount);
    web3.eth.getBalance(web3.eth.defaultAccount).then(res => {
      let myBalance = web3.utils.fromWei(res, 'ether');
      let nonce = web3.eth.getTransactionCount(web3.eth.defaultAccount).then(nonce => {
        getCurrentGasPrices().then(response => {
          let gasPrice = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
          }
          console.log(gasPrice);
          let details = {
            "to": process.env.ACCOUNT_TO,
            "from": process.env.ACCOUNT_ADDRESS,
            "value": 124423387878344,
            "gas": 21000,
            "gasPrice": gasPrice.low * 1000000000, // converts the gwei price to wei
            "nonce": nonce,
            "chainId": 88888 // EIP 155 chainId - mainnet: 1, rinkeby: 4
          }

          const transaction = new EthereumTx(details);

          transaction.sign(privateKey);

          const serializedTransaction = `0x${transaction.serialize().toString('hex')}`;

          web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex')).then((response) => {
            console.log('TEST TEST');
            console.log(response);
          })
          .catch(err => {
            console.log(err.message);
          })

          /* const transactionId = web3.eth.sendSignedTransaction(serializedTransaction).then(e => {
            console.log(e);
          })
          .catch(r => {
            console.log(r.message);
          }) */
        


        })

      })
      //console.log(res.toNumber());
    });
   /*  console.log(myBalanceWei);
    console.log('TEST', myBalance, myBalanceWei); */
  } catch(err) {
    console.log('ERROR', err.message);
  }
}


 
const acc = '{ "address": "21d7dc0f1aa5426a14f5f3c38695062d7a0bb1d2", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "9cf032c4088b5921424d612a69b8a20c616aef73a0cb5f379ae3339c7b4769b5", "cipherparams": { "iv": "6d56fe43f0a90292a38c53f49c7aacc9" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 262144, "p": 1, "r": 8, "salt": "7d7be88fbcf2a9363c61193666e271f15adc17d71d2b621d714c0f050d74cb97" }, "mac": "7cef06c130f7e2f5974e09b89f3f401325f30d47b78e200aa49514370f9d32c3" }, "id": "d6b8f976-b59b-4912-88d7-630c36c7285d", "version": 3 }'

let accString = web3.eth.accounts.decrypt(JSON.parse(acc), 'sr61ja80');

console.log(accString);
let privateKey = new Buffer(accString.privateKey.substr(2), 'hex');
main(privateKey);
/* 
keythereum.importFromFile(process.env.ACCOUNT_ADDRESS, './testnode/node1/', function (keyObject) {
  // do stuff
  keythereum.recover(process.env.ACCOUNT_PASSWORD, keyObject, function (privateKey) {
    // do stuff
    console.log(privateKey.toString('hex'));

  });
}); */
