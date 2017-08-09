const SHA256 = require('crypto-js/sha256')



function getTime() {
  return new Date().getTime() / 1000;
}

function getTimeRound() {
  return Math.round(getTime());
}



class BlockChain {

  constructor(nbBlocksForDifficultyCalculation, timeBeetweenTwoBlock, difficulty = 0) {
    this.nbBlocksForDifficultyCalculation = nbBlocksForDifficultyCalculation;
    this.timeBeetweenTwoBlock = timeBeetweenTwoBlock;
    this.difficulty = difficulty;

    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    let block = new Block(0, getTimeRound(), "", this.difficulty);
    block.mineHash();
    return block;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {

    if(newBlock.difficulty == this.difficulty && newBlock.isBlockValid(this.difficulty)) {
      this.addBlockWithoutDifficulty(newBlock);

      if(this.needToChangeDifficulty()) {
        this.calculateNewDifficulty();
      }

      return true;

    }

    console.log("Block #" + i + " can't be added to the BlockChain (Wrong difficulty).");
    return false;

  }

  addBlockWithoutDifficulty(newBlock) {
    this.chain.push(newBlock);
  }

  needToChangeDifficulty() {
    let latestBlock = this.getLatestBlock();

    if(latestBlock.index % this.nbBlocksForDifficultyCalculation == 0) {
      return true;
    }

    return false;

  }

  calculateNewDifficulty() {

    let latestBlock = this.getLatestBlock();
    let previousBlock = this.chain[latestBlock.index - 1];

    //calculate the average time to find a nonce
    let total = 0;
    for(let i = this.chain.length - this.nbBlocksForDifficultyCalculation; i <= this.chain.length - 1; i++) {
      let latestBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];

      let diff = latestBlock.timestamp - previousBlock.timestamp;
      total = total + diff;
    }

    let averageTime = total / (this.chain.length - (this.chain.length - this.nbBlocksForDifficultyCalculation));

    //if the average is not in the 25%, then update the difficulty of the blockchain for next blocks
    if(averageTime > (this.timeBeetweenTwoBlock + (this.timeBeetweenTwoBlock * 0.25))) {
      if(this.difficulty != 0)
        this.difficulty--;
    } else if (averageTime < (this.timeBeetweenTwoBlock - (this.timeBeetweenTwoBlock * 0.25))) {
      this.difficulty++;
    }

    console.log("Average time beetween two block: " + averageTime + ", new difficulty: " + this.difficulty)

  }

  isChainValid() {

    for(let i = 1; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];

      

      if(!currentBlock.isBlockValid()) {
        return false;
      }

      if(currentBlock.previousHash != previousBlock.hash) {
        return false;
      }

    }

    return true;

  }

  hasBlockInChain(block) {
    for(let i = 0; i < this.chain.length; i++) {
      if(block == this.chain[i])
        return true;
    }

    return false;
  }

}



class Block {

  constructor(index, timestamp, data, difficulty, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = 0;
  }

  isBlockValid() {
    var start = "";

    for(var i = 0; i < this.difficulty; i++) {
      start = start + "" + 0;
    }


    if(this.hash != this.calculateHash()) {
      return false;
    }

    if(this.hash.substring(0, this.difficulty) != start) {
      return false;
    }

    if(this.hash.substring(this.difficulty, this.difficulty + 1) == 0) {
      return false;
    }

    return true;

  }

  calculateHash() {
    return SHA256(this.index + this.nonce + this.previousHash + this.difficulty + this.timestamp + JSON.stringify(this.data)).toString();
  }

  mineHash() {
    let startMiningBlock = getTime();

    let hash = "";
    let start = "";

    for(let i = 0; i < this.difficulty; i++) {
      start = start + "" + 0;
    }


    let number = 0;
    while((hash.substring(0, this.difficulty) != start) || (hash.substring(this.difficulty, this.difficulty + 1) == 0)) {
      this.nonce = Math.round(Math.random() * (4294967296 - 0) + 0); //nonce 32 bits
      hash = this.calculateHash();
    }



    this.hash = hash;
    


    let timeToMine = getTime() - startMiningBlock;
    console.log("Block #" + this.index + " difficulty(" + this.difficulty + ") mined in " + timeToMine + "s with nonce " + this.nonce + " (" + this.hash + ")");
  }

}






//nbBlocksForDifficultyCalculation (200 blocks), timeBeetweenTwoBlock (20s), default difficulty (4)
var blockChain = new BlockChain(200, 20, 4);



var run = true;
while(run) {
  var index = blockChain.getLatestBlock().index + 1;
  var block = new Block(index, getTimeRound(), "Content #" + index, blockChain.difficulty);
  block.previousHash = blockChain.getLatestBlock().hash;
  block.mineHash();
  blockChain.addBlock(block);
}