const BLockchain = require('./blockchain');
const Block = require("../Block/block");
const Blockchain = require('./blockchain');

describe('Blockchain', () => {
    let blockchain;
    let newChain;
    let originalChain;

    beforeEach(() => {
        blockchain = new BLockchain();
        newChain = new BLockchain();
        originalChain = blockchain.chain;
    })

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the gensis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo-bar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {

        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'Alpha' });
                blockchain.addBlock({ data: 'Beta' });
                blockchain.addBlock({ data: 'Gamma' });
            });

            describe('and a lastHase reference has changed', () => {
                it('return false', () => {
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'bad - datas';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('return true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () => {

        // Stub
        let errorMock;
        let logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0] = { new: 'new chain' };
                blockchain.replaceChain(newChain.chain);
            });
            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs the error for chain length', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'Alpha' });
                newChain.addBlock({ data: 'Beta' });
                newChain.addBlock({ data: 'Gamma' });
            })
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'some fake hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it('logs the error Blockchain isValid chain', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);

                });
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it('logs about the chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});