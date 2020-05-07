const { RelayProvider, configureGSN } = require('@opengsn/gsn')
const GsnTestEnvironment = require('@opengsn/gsn/dist/GsnTestEnvironment' ).default
const ethers = require('ethers')
const { it, describe, before } = require('mocha')
const { assert } = require('chai')

const Web3HttpProvider = require( 'web3-providers-http')

//we still use truffle compiled files
Counter = require('../artifacts/Counter')

describe('using ethers with OpenGSN', () => {
    let counter
    let accounts
    let web3provider
    let from
    before(async () => {
	let env = await GsnTestEnvironment.startGsn('localhost')
	const { relayHubAddress, paymasterAddress, stakeManagerAddress, forwarderAddress } = env.deploymentResult

        web3provider = new Web3HttpProvider('http://localhost:8545')
        const etherProvider1 = new ethers.providers.Web3Provider(web3provider)

        accounts = await etherProvider1.listAccounts()

        from = accounts[0]
        const factory = new ethers.ContractFactory(Counter.abi, Counter.bytecode, etherProvider1.getSigner())

        counter = await factory.deploy(forwarderAddress)
        await counter.deployed()

        const config = configureGSN({
            verbose: false,
            relayHubAddress,
            stakeManagerAddress,
            paymasterAddress,
        })
        const gsnProvider = new RelayProvider(web3provider, config)
	// The above is the full provider configuration. can use the provider returned by startGsn:
        // const gsnProvider = env.relayProvider
        const etherProvider = new ethers.providers.Web3Provider(gsnProvider)

        counter = counter.connect(etherProvider.getSigner())

    })

    describe('make a call', async () => {
        let counterChange
        let balanceUsed
        before(async () => {
            const beforeBalance = await counter.provider.getBalance(from)
            const countBefore = await counter.counter()
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

