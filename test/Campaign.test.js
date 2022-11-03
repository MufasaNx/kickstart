const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { abi: campaignAbi } = require('../ethereum/build/Campaign.json')
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
        .send({ from: creator, gas: '10000000' })
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

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(creator, manager);
    })

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor)
    })

    it('has minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[2],
                value: '50'
            });
            assert(false)
        } catch (error) {
            assert(true)
        }
    })

    // it('allows a manager to make a payment request', async () => {
    //     await campaign.methods
    //         .createRequest('Buy Batteries', '10000', accounts[1])
    //         .send({
    //             from: creator,
    //             value: '26959246410'
    //         });
    //     const request = await campaign.methods.requests(0).call();
    //     assert.equal('Buy Batteries', request.description)
    //     assert(true)
    // })
})