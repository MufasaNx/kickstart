const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { abi: campaignAbi, evm: { bytecode: campaignBytecode } } = require('../ethereum/build/Campaign.json')
const { abi: factoryAbi, evm: { bytecode: factoryBytecode } } = require('../ethereum/build/CampaignFactory.json')

let accounts
let creator
let factory
let campaign
let campaignAddress

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    // Use one of those accounts to deploy the contract
    creator = accounts[0]
    // Create factory
    factory = await new web3.eth.Contract(factoryAbi)
        .deploy({ data: factoryBytecode.object })
        .send({ from: creator, gas: '1000000' })
    // Create Campaign
    await factory.methods.createCampaign('100').send({
        from: creator, 
        gas: '1000000'
    });
    // Get deployed addresses
    [ campaignAddress ] = await factory.methods.getDeployedCampaigns().call()
    // Get deployed Contract
    campaign = await new web3.eth.Contract(
        campaignAbi,
        campaignAddress
    )
})
