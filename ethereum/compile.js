const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

// Path of the build folder
const buildPath = path.resolve(__dirname, 'build');
// Remove build folder
fs.removeSync(buildPath);

// Path of the contract
const campaignPath = path.resolve(__dirname, 'contracts', "Campaign.sol")
// Read file contents
const source = fs.readFileSync(campaignPath, 'utf8')

// Prepare input for Compilation
var input = {
    language: 'Solidity',
    sources: {
      'Campaign': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  
// Compile contracts
const contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
console.log(contracts);

// Create build folder
fs.ensureDirSync(buildPath);

let i = 0;
// Write contracts into build folder
for (var contractName in contracts['Campaign']) {
    fs.outputJSONSync(
        path.resolve(buildPath, `${contractName}.json`),
        contracts['Campaign'][contractName]
    )
}
