// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9; 

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract PMTR is ERC721A, Ownable, ReentrancyGuard {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  string public notRevealedUri; 

  uint256 public firstCost = 0.0045 ether; //put equal usd values
  uint256 public secondCost = 0.009 ether; // ''
  uint256 public thirdCost = 0.018 ether; // ''
  
  uint256 private cost;
  uint256 public wlCost = 0.0025 ether;

  uint256 public maxSupply = 10000;
  uint256 public maxWlSupply = 200; // only 100 after mint 100 in airdrop
  uint256 public maxAirdropSupply = 100;

  uint256 public MaxperWallet = 10;
  uint256 public MaxperWalletWL = 1;
  uint256 public MaxPerWalletAirdrop = 1; // add a function to change this

  bool public paused = false;
  bool public revealed = true;
  bool public wlMint = false;
  bool public publicSale = true;
  bool public airdropEnabled = false; // add a function to change this

  bytes32 public merkleRoot = 0;

  error InsufficientFunds();
  error maxPerWalletExceeded ();

  constructor(
    string memory _initBaseURI
  ) ERC721A("Pyramid Mystery Temple Reunion", "PMTR") {
    setBaseURI(_initBaseURI);
    
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }
      function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

  // public sale mint

  function publicSaleMint(uint256 tokens) public payable nonReentrant {
    require(!paused, "oops! contract is paused");
    require(publicSale, "Sale Hasn't started yet");
    uint256 supply = totalSupply();
    require(tokens > 0, "need to mint at least 1 NFT");
    require(tokens <= MaxperWallet, "max mint amount per Tx exceeded");
    require(supply + tokens <= maxSupply, "We Soldout");
    if(supply + tokens > 7700)
      {
        cost = thirdCost ;
        }
    else if (supply + tokens > 4000)
    {
      cost = secondCost ;
    }
    else  {
      cost = firstCost ;
    }
    require(msg.value >= cost * tokens, "insufficient funds");
    
      
    _safeMint(_msgSender(), tokens);
    
  }
/// @dev WLsale for Wl addresses

    function WLMint(uint256 tokens, bytes32[] calldata merkleProof) public payable nonReentrant {
    require(!paused, "oops contract is paused");
    require(wlMint, "wlMint Hasn't started yet");
    require(MerkleProof.verify(merkleProof, merkleRoot, keccak256(abi.encodePacked(msg.sender))), " You are not in the Team");
    uint256 supply = totalSupply();
    require(_numberMinted(_msgSender()) + tokens <= MaxperWalletWL, "Max NFT Per Wallet exceeded");
    require(tokens > 0, "need to mint at least 1 NFT");
    require(supply + tokens <= maxWlSupply, "Max Whitelisted-sale supply reached");
    require(supply + tokens <= maxSupply, "We soldout");
    require(tokens <= MaxperWalletWL, "max mint amount per Tx exceeded");
    require(msg.value >= wlCost ,"insufficient funds");

      _safeMint(_msgSender(), tokens);
    
  }

  // Airdrop for public

    function Airdrop(uint256 tokens) public nonReentrant {
      require(airdropEnabled , "Airdrop isn't available yet");
      require(!paused, "oops! contract is paused");
      uint256 supply = totalSupply();
      require(_numberMinted(_msgSender()) + tokens <= MaxPerWalletAirdrop, "Max NFT Per Wallet exceeded");
      require(tokens > 0, "need to mint at least 1 NFT");
      require(supply + tokens <= maxAirdropSupply, "max Airdrop supply reached");
      require(supply + tokens <= maxSupply, "We soldout");
      require(tokens <= MaxPerWalletAirdrop, "max mint amount per Tx exceeded");
      

      _safeMint(_msgSender(), tokens);
    }




  /// @dev use it for giveaway and mint for yourself
    function gift(uint256 _mintAmount, address destination) public onlyOwner nonReentrant {
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    uint256 supply = totalSupply();
    require( supply + _mintAmount <= maxSupply, "max NFT limit exceeded");

      _safeMint(destination, _mintAmount);
    
  }

  


  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721AMetadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

    function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  //only owner
  function reveal(bool _state) public onlyOwner {
      revealed = _state;
  }

  function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }
  
  function setMaxPerWallet(uint256 _limit) public onlyOwner {
    MaxperWallet = _limit;
  }

    function setMaxperWalletWL(uint256 _limit) public onlyOwner {
    MaxperWalletWL = _limit;
  }

    function setMaxPerWalletAirdrop(uint256 _limit) public onlyOwner {
    MaxPerWalletAirdrop = _limit;
  }
  
  
  function setFirstCost(uint256 _newCost) public onlyOwner {
    firstCost = _newCost;
  }

  function setSecondCost(uint256 _newCost) public onlyOwner {
    secondCost = _newCost;
  }

  function setThirdCost(uint256 _newCost) public onlyOwner {
    thirdCost = _newCost;
  }

    function setWlCost(uint256 _newwlCost) public onlyOwner {
    wlCost = _newwlCost;
  }


    function setMaxsupply(uint256 _newsupply) public onlyOwner {
    maxSupply = _newsupply;
  }

     function setMaxAirdropSupply(uint256 _newsupply) public onlyOwner {
    maxAirdropSupply = _newsupply;
  }

     function setMaxWlSupply(uint256 _newsupply) public onlyOwner {
    maxWlSupply = _newsupply;
  }

 
  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

    function togglewlMint(bool _state) external onlyOwner {
        wlMint = _state;
    }

    function togglepublicSale(bool _state) external onlyOwner {
        publicSale = _state;
    }

    function enableAirdrop(bool _state) external onlyOwner {
        airdropEnabled = _state;
    }

  
 
  function withdraw() public payable onlyOwner nonReentrant {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
}