const { GENESIS_DATA, MINE_RATE } = require("../config/config");
const cryptoHash = require("../crypto/crypto-hash");
class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new Block(GENESIS_DATA);

        // also can be implelemted like
        // return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        const difference = timestamp - originalBlock.timestamp;
        if(difficulty < 1) return 1;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) {
            return difficulty - 1;
        }
        return difficulty + 1;
    }
}

module.exports = Block;