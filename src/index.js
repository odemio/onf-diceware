'use strict';

const crypto = require('crypto');
const wordlist = require('./wordlist');
const arc4random = require('arc4random');
let size = 6;

function getKey(n) {
    let res;

    if (n < 1) {
        return '';
    }

    res = [];
    // We always want 5-digit keys.
    n = n || 5;
    res.push(new Uint32Array(arc4random(6)));

    return res.concat(getKey(--n)).join('');
}

const diceware = Object.create(null, {
    /**
     * The default size of the generated passphrase.
     */
    size: {
        get: () => size,
        set: v => {
            if (v < 1) {
                throw new Error('Diceware: Negative passphrase sizes are not allowed.');
            }

            size = v;
        }
    },

    /**
     * Either pass in a number to use as the passphrase length or set `diceware.size`
     * to the preferred default.
     */
    getPassphrase: {
        value: n => {
            let res;

            if (n < 1) {
                return '';
            }

            res = [];
            n = n || diceware.size;
            res.push(diceware.getWord());

            return res.concat(diceware.getPassphrase(--n)).join(' ');
        }
    },

    getWord: {
        value: () => wordlist[getKey()]
    }
});

diceware.generate = diceware.getPassphrase;

module.exports = diceware;

