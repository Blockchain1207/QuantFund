module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: "*",
      gas: 4700000
    }
  },
  compilers: {
    solc: {
      version: "^0.4.11",
      docker: false,
      parser: "solcjs",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        //evmVersion: istanbul
      },
      modelCheckerSettings: {
      }
    }
  }
}
