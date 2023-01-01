const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('../scripts/whitelist.js')




import { config } from '../dapp.config'

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)

const contract = require('../artifacts/contracts/PMTR.sol/PMTR.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

// Supply Amounts 

export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

export const getNumberMinted = async () => {
  const NumberMinted = await nftContract.methods.numberMinted(window.ethereum.selectedAddress) .call()
  return NumberMinted
}

export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxSupply().call()
  return maxSupply
}

//Max Limits
export const getMaxperWallet = async() => {
  const maxLimit = await nftContract.methods.MaxperWallet().call()
  return maxLimit
}
export const getMaxperWalletWl = async() => {
  const maxLimit = await nftContract.methods.MaxperWalletWL().call()
  return maxLimit
}
export const getMaxperWalletAirdrop = async() => {
  const maxLimit = await nftContract.methods.MaxPerWalletAirdrop().call()
  return maxLimit
}

// States

export const isPausedState = async () => {
  const paused = await nftContract.methods.paused().call()
  return paused
}

export const isPublicSaleState = async () => {
  const publicSale = await nftContract.methods.publicSale().call()
  return publicSale
}

export const isAirdropState = async () => {
  const WlMint = await nftContract.methods.airdropEnabled().call()
  return WlMint
}

export const isWlMintState = async () => {
  const WlMint = await nftContract.methods.wlMint().call()
  return WlMint
}

// Minting Prices

// export const getWlCost = async () => {
//     const PresalePrice = await nftContract.methods.wlCost().call()
//     return PresalePrice
// }
// export const getFirstCost = async () => {
//     const Price = await nftContract.methods.firsCost().call()
//     return Price
// }
// export const getSecondCost = async () => {
//   const Price = await nftContract.methods.secondCost().call()
//   return Price
// }
// export const getThirdCost = async () => {
//   const Price = await nftContract.methods.thirdCost().call()
//   return Price
// }



//Set up wl mint------------------------------------------------------------------------------------>

export const wlMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)

  if (!isValid) { 
    return {
      success: false,
      status: '❌ Invalid Merkle Proof - You are not whitelisted'
    }
  }
  
  const wallet =(window.ethereum.selectedAddress)
  const numberMinted = await nftContract.methods.numberMinted(wallet) .call()
  const maxLimit = await nftContract.methods.MaxperWalletWL().call()
  const cost = await nftContract.methods.wlCost()
  const AbleToMint = (maxLimit - numberMinted)

  if (AbleToMint <  mintAmount){
    return {
      success: false,
      status: '📌 Exceeded max mint amount per wallet'  
    }
  }
  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(cost), 'Wei')
    ).toString(16), // hex
    gas: String(25000 * mintAmount),
    data: nftContract.methods
      .WLMint(mintAmount, proof)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p className='underline'>✅ Check out your transaction on Etherscan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}

//Set up public sale mint----------------------------------------------------------------------------------------------------->

export const publicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const wallet =(window.ethereum.selectedAddress)
  const numberMinted = await nftContract.methods.numberMinted(wallet) .call()
  const totalMinted = await nftContract.methods.totalSupply().call()

  const firstCost = await nftContract.methods.firstCost().call()
  const secondCost = await nftContract.methods.secondCost().call()
  const thirdCost = await nftContract.methods.thirdCost().call()
  const cost = ( totalMinted > 7700 ? thirdCost : totalMinted > 4000 ? secondCost : firstCost)
  const maxLimit = await nftContract.methods.MaxperWallet().call()
  const AbleToMint = maxLimit - numberMinted 


  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
  

  if (AbleToMint <  mintAmount){
    return {
      success: false,
      status: '📌 Exceeded max mint amount per wallet' 
    }
  }


  

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(cost*mintAmount), 'Wei')
    ).toString(16), // hex
    gas: String(30000),
    data: nftContract.methods.publicSaleMint(mintAmount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p className='underline'>✅ Check out your transaction on Etherscan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }

}


  // setup airdrop ------------------------------------------------------------------------------------

export const airdrop = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const wallet =(window.ethereum.selectedAddress)
  const numberMinted = await nftContract.methods.numberMinted(wallet) .call()
  const maxLimit = await nftContract.methods.MaxPerWalletAirdrop().call()
  const AbleToMint = maxLimit - numberMinted


  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
  

  if (AbleToMint <  mintAmount){
    return {
      success: false,
      status: '📌 Exceeded max mint amount per wallet' 
    }
  }

    // Set up our Ethereum transaction
    const tx = {
      to: config.contractAddress,
      from: window.ethereum.selectedAddress,
      gas: String(30000),
      data: nftContract.methods.Airdrop(mintAmount).encodeABI(),
      nonce: nonce.toString(16)
    }
  
    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })
  
      return {
        success: true,
        status: (
          <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
            <p className='underline'>✅ Check out your transaction on Etherscan ✅</p>
          </a>
        )
      }
    } catch (error) {
      return {
        success: false,
        status: '😞 Smth went wrong:' + error.message
      }
    }
  

}