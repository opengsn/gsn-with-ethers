module.exports = {
  networks: {
    local: {
      url: 'http://localhost:8545',
      gas: 1e8,
      blockGasLimit: 1e8
    },
  },
  solidity: "0.8.7",
  solc: {
    version: '0.8.7',
    optimizer: {
      enabled: true,
      runs: 1
    }
  }
}
