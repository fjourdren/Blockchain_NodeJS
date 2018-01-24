const Block = require('./Block'),
      BlockChain = require('./Blockchain'),
      Utils = require('./Utils');

//nbBlocksForDifficultyCalculation (200 blocks), timeBeetweenTwoBlock (20s), default difficulty (4)
var blockChain = new BlockChain(200, 20, 4);

var run = true;
while (run) {
  var index = blockChain.getLatestBlock().index + 1;
  var block = new Block(index, Utils.getTimeRound(), "Content #" + index, blockChain.difficulty);
  block.previousHash = blockChain.getLatestBlock().hash;
  block.mineHash();
  blockChain.addBlock(block);
}