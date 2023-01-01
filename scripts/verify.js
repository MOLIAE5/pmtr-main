require ('@nomiclabs/hardhat-etherscan')
const hre = require( 'hardhat')


const _initBaseURI='ipfs://bafybeifkky453kqqzxy54aefxsfbar4tylaymrxn6jbns26i5lx2wtsphe/'

async function main() {

  await hre.run('verify:verify', {
    address: '0xdF060731474f293cb6BB1529F64A8958a05ED6EC',//
    constructorArguments: [_initBaseURI]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })