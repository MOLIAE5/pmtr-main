const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')

const _initBaseURI='ipfs://QmY8j6RaBekRn7T536urybkACQwcqbqnQyPTNCp6JdQgZ9/'

async function main() {
  const nftFactory = await hre.ethers.getContractFactory('PMTR')
  const nftContract = await nftFactory.attach(
    '0xf47F5A0968877F1CDeB73175B46DdFAd275e3430'
  )

    // Calculate merkle root from the whitelist array
    const leafNodes = whitelist.map((addr) => keccak256(addr))
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
    const root = merkleTree.getRoot().toString('hex')
    console.log(' Merkleroot is: 0x' + root)

    let arr = [
    
    '0x2b312D8Af6400f1b19d1c282553310b33Cf8d43a',
    '0x8754C7b8a8a3aacCE661832Eb9503960C5D506c8'
  ];
    for (let address of arr) {
      const leaf = keccak256(address)
      const proof = merkleTree.getHexProof(leaf).toString('hex')
      console.log (' ')
      
      console.log('proof for( ' + address + ' )is: ' + proof)
      console.log (' ')
      

    }
    
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
