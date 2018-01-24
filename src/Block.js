const SHA256 = require('crypto-js/sha256'),
	  Utils = require('./Utils');

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
    let startMiningBlock = Utils.getTime();

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
    


    let timeToMine = Utils.getTime() - startMiningBlock;
    console.log("Block #" + this.index + " difficulty(" + this.difficulty + ") mined in " + timeToMine + "s with nonce " + this.nonce + " (" + this.hash + ")");
  }

}


module.exports = Block;