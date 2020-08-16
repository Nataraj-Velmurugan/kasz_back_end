const Block = require("./block");

const Block = require("./block");

describe('Block', () => {
    const timestamp = '';
    const lastHash = '';
    const hash = '';
    const data = ['', ''];
    const block = new Block({timestamp, lastHash, hash, data});

    it('has a timestamp, lasthash, hash, data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    })
})