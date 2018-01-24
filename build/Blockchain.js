const Block = require('./Block'),
      Utils = require('./Utils');

class BlockChain {

  constructor(nbBlocksForDifficultyCalculation, timeBeetweenTwoBlock, difficulty = 0) {
    this.nbBlocksForDifficultyCalculation = nbBlocksForDifficultyCalculation;
    this.timeBeetweenTwoBlock = timeBeetweenTwoBlock;
    this.difficulty = difficulty;

    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    let block = new Block(0, Utils.getTimeRound(), "", this.difficulty);
    block.mineHash();
    return block;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {

    if (newBlock.difficulty == this.difficulty && newBlock.isBlockValid(this.difficulty)) {
      this.addBlockWithoutDifficulty(newBlock);

      if (this.needToChangeDifficulty()) {
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

    if (latestBlock.index % this.nbBlocksForDifficultyCalculation == 0) {
      return true;
    }

    return false;
  }

  calculateNewDifficulty() {

    let latestBlock = this.getLatestBlock();
    let previousBlock = this.chain[latestBlock.index - 1];

    //calculate the average time to find a nonce
    let total = 0;
    for (let i = this.chain.length - this.nbBlocksForDifficultyCalculation; i <= this.chain.length - 1; i++) {
      let latestBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];

      let diff = latestBlock.timestamp - previousBlock.timestamp;
      total = total + diff;
    }

    let averageTime = total / (this.chain.length - (this.chain.length - this.nbBlocksForDifficultyCalculation));

    //if the average is not in the 25%, then update the difficulty of the blockchain for next blocks
    if (averageTime > this.timeBeetweenTwoBlock + this.timeBeetweenTwoBlock * 0.25) {
      if (this.difficulty != 0) this.difficulty--;
    } else if (averageTime < this.timeBeetweenTwoBlock - this.timeBeetweenTwoBlock * 0.25) {
      this.difficulty++;
    }

    console.log("Average time beetween two block: " + averageTime + ", new difficulty: " + this.difficulty);
  }

  isChainValid() {

    for (let i = 1; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];

      if (!currentBlock.isBlockValid()) {
        return false;
      }

      if (currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  hasBlockInChain(block) {
    for (let i = 0; i < this.chain.length; i++) {
      if (block == this.chain[i]) return true;
    }

    return false;
  }

}

module.exports = BlockChain;