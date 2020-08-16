const Block = require("./block");
const { GENESIS_DATA } = require("../config/config");
const cryptoHash = require('../crypto/crypto-hash');

describe('Block', () => {
    const timestamp = '';
    const lastHash = '';
    const hash = '';
    const data = ['block', 'data'];
    const block = new Block({timestamp, lastHash, hash, data});

    it('has a timestamp, lasthash, hash, data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        const genBlock = new Block(GENESIS_DATA);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toEqual(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
            expect(genBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('return the Block instance', () => {
            expect(minedBlock instanceof Block).toEqual(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () =>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA 256 - `hash`', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });


    });


})