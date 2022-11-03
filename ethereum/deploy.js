const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { abi, evm: { bytecode } } = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider({
    mnemonic: process.env.ETH_MNEMONIC_PHRASE,
    providerOrUrl: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
})

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0])

    const factory = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode.object })
        .send({ gas: '1000000', from: accounts[0] })

    console.log('abi ', JSON.stringify(abi));
    console.log('Contract deployed at', factory.options.address)
    provider.engine.stop();
}

deploy()