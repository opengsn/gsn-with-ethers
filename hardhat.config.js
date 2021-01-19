// yarn add -D @nomiclabs/buidler @nomiclabs/buidler-truffle5 @nomiclabs/buidler-web3
// buidler test - supports stack traces, logs (also faster to launch than truffle)
// buidler test --network ganache : just faster launcher
// for logs:
//   import "nomiclabs/buidler/console.log";
//   console.log("a=%s addr=%s", 1, this);

// eslint-disable-next-line no-undef
require('@nomiclabs/hardhat-ethers')

module.exports = {
  networks: {
    buidlerevm: {
      url: 'http://localhost:8545',
      gas: 1e8,
      blockGasLimit: 1e8
    },
    ganache: {
      url: 'http://localhost:8545'
    }
  },
  solidity: "0.6.2",
  solc: {
    version: '0.6.2',
    optimizer: {
      enabled: true,
      runs: 1
    }
  }
}
