const hre = require('hardhat')

const _initBaseURI='ipfs://bafybeifkky453kqqzxy54aefxsfbar4tylaymrxn6jbns26i5lx2wtsphe/'

async function main() {

  // Deploy the contract
  const pmtr = await hre.ethers.getContractFactory('PMTR')
  const PMTR = await pmtr.deploy(
    _initBaseURI)
  await PMTR.deployed()

  console.log('Contract deployed to:', PMTR.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
