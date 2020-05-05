const {RelayProvider, configureGSN} = require('@opengsn/gsn')
const ethers = require('ethers')
const {it, describe, before} = require('mocha')
const {assert} = require('chai')
let relayHubAddress
try {
    relayHubAddress = require('../build/gsn/RelayHub').address
} catch (e) {
    throw new Error('must use "gsn" tools to deploy hub (and start relay)')
}

const stakeManagerAddress = require('../build/gsn/StakeManager').address
const paymasterAddress = require('../build/gsn/Paymaster').address
const forwarder = require('../build/gsn/Forwarder').address

const Web3 = require('web3')
//we still use truffle compiled files
Counter = require('../build/contracts/Counter')

describe('using ethers with OpenGSN', () => {
    let counter
    let accounts
    let web3provider
    let from
    before(async () => {

        web3provider = new Web3.providers.HttpProvider('http://localhost:8545')
        const etherProvider1 = new ethers.providers.Web3Provider(web3provider)

        accounts = await etherProvider1.listAccounts()

        from = accounts[0]
        const factory = new ethers.ContractFactory(Counter.abi, Counter.bytecode, etherProvider1.getSigner())

        counter = await factory.deploy(forwarder)
        await counter.deployed()

        const config = configureGSN({
            verbose: false,
            relayHubAddress,
            stakeManagerAddress,
            paymasterAddress,
        })
        const gsnProvider = new RelayProvider(web3provider, config)
        const etherProvider = new ethers.providers.Web3Provider(gsnProvider)

        counter = counter.connect(etherProvider.getSigner())

    })

    describe('make a call', async () => {
        let counterChange
        let balanceUsed
        before(async () => {
            const beforeBalance = await counter.provider.getBalance(from)
            const countBefore = await counter.counter()
            //cannot pass "from" value: must use accounts[0] (ether prevent contract calls to provide di
            await counter.increment()
            const countAfter = await counter.counter()
            const afterBalance = await counter.provider.getBalance(from)
            balanceUsed = beforeBalance - afterBalance
            counterChange = countAfter - countBefore
        })

        it('should make a call (have counter incremented)', async () => {

            assert.equal(1, counterChange)
        })

        it('should not pay for gas', async () => {
            assert.equal(0, balanceUsed)
        })

        it('should see the real caller', async () => {
            assert.equal(from, await counter.lastCaller())
        });
    })
})

