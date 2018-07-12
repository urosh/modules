let web3 = require('web3');

const dotenv = require('dotenv').config();

web3 = new web3(new web3.providers.HttpProvider('http://localhost:8545'));

console.log(web3);
const ethTx = ('0xf05d658545cdf3f3f2dde72465c359c43dd130da839c69fd6e1c3b127a2f6238');

/* web3.eth.getTransaction(ethTx, (err, result) => {
  if(!err) {
    console.log('From Address: ' + result.from);
    console.log('To Address: ' + result.to);
    console.log('Ethere transacted: ' + (web3.utils.fromWei(result.value, 'ether')));
  }else{
    console.log('Error!', err);
  }
}) */


