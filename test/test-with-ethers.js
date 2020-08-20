const { RelayProvider, resolveConfigurationGSN } = require('@opengsn/gsn')
const { GsnTestEnvironment } = require('@opengsn/gsn/dist/GsnTestEnvironment' )
const ethers = require('ethers')
const { it, describe, before } = require('mocha')
const { assert } = require('chai')

const Web3HttpProvider = require( 'web3-providers-http')

//we still use truffle compiled files
const Counter = require('../artifacts/Counter')

describe('using ethers with OpenGSN', () => {
    let counter
    let accounts
    let web3provider
    let from
    before(async () => {
	let env = await GsnTestEnvironment.startGsn('localhost')
	const { naivePaymasterAddress, forwarderAddress } = env.deploymentResult

    
        const web3provider = new Web3HttpProvider('http://localhost:8545')
 
        const deploymentProvider= new ethers.providers.Web3Provider(web3provider)

        const factory = new ethers.ContractFactory(Counter.abi, Counter.bytecode, deploymentProvider.getSigner())

        counter = await factory.deploy(forwarderAddress)
        await counter.deployed()

        const config = await resolveConfigurationGSN(web3provider, {
            // verbose: true,
            forwarderAddress,
            paymasterAddress: naivePaymasterAddress,
        })
        // const hdweb3provider = new HDWallet('0x123456', 'http://localhost:8545')
        let gsnProvider = new RelayProvider(web3provider, config)
	   // The above is the full provider configuration. can use the provider returned by startGsn:
        // const gsnProvider = env.relayProvider

    	const account = new ethers.Wallet(Buffer.from('1'.repeat(64),'hex'))
        gsnProvider.addAccount({address:account.address, privateKey: Buffer.from(account.privateKey.replace('0x',''),'hex') })
    	from = account.address

        // gsnProvider is now an rpc provider with GSN support. make it an ethers provider:
        const etherProvider = new ethers.providers.Web3Provider(gsnProvider)

        counter = counter.connect(etherProvider.getSigner(from))
    })

    describe('make a call', async () => {
        let counterChange
        let balanceUsed
        before(async () => {
            const countBefore = await counter.counter()
            await counter.increment()
            const countAfter = await counter.counter()
            counterChange = countAfter - countBefore
        })

        it('should make a call (have counter incremented)', async () => {

            assert.equal(1, counterChange)
        })

        it('should not pay for gas (balance=0)', async () => {
            assert.equal(0, await counter.provider.getBalance(from))
        })

        it('should see the real caller', async () => {
            assert.equal(from.toLowerCase(), (await counter.lastCaller()).toLowerCase())
        });
    })
})

