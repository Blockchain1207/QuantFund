import Web3 from 'web3'
import C20Contract from '../../build/contracts/C20.json'
import Config from '../../truffle-config.js'
import getTransactionReceiptMined from '../utils/getTransactionReceiptMined.js'

const getC20Instance = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async() => {
    let result
    let web3 = window.web3
    let provider

    if (window.ethereum)
    {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log('access denied');
      }
    }

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      provider = web3.currentProvider
      console.log('Injected web3 detected.');
    } else {
      // Fallback to localhost if no web3 injection.
      const { host, port } = Config.networks[process.env.NODE_ENV]
      provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)

      console.log('No web3 instance injected, using Local web3.')
    }

    web3 = new Web3(provider)
    result = {
      web3: web3
    }

    result.web3.eth.getTransactionReceiptMined = getTransactionReceiptMined
    const contract = require('truffle-contract')
    const regulator = contract(C20Contract)
    regulator.setProvider(provider)

    const web3RPC = new Web3(provider)

    web3RPC.eth.getAccounts((error, accounts) => {
      result.accounts = accounts
      //mainnet
      //const c20ContractAddress = (parseInt(web3.version.network, 10) === 1 ? '0x7A3B407076E3F39c1032d77cD28C8ceED977265A' : '0x61197998b3c0361bE9AC85959efF0153aE76cbf4')
      //testnet
      const c20ContractAddress = (parseInt(web3.version.network, 10) === 1 ? '0x26e75307fc0c021472feb8f727839531f112f317' : '0x61197998b3c0361bE9AC85959efF0153aE76cbf4')

      return regulator.at(c20ContractAddress).then((c20Instance) => {
        result.c20Instance = c20Instance
        resolve(result)
      })
    })
  })
})

export default getC20Instance
