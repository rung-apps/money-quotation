const { create } = require('rung-sdk');
const { OneOf, Money } = require('rung-sdk/dist/types');
const Bluebird = require('bluebird');
const agent = require('superagent');
const promisifyAgent = require('superagent-promise');
const { path, lt, gt } = require('ramda');

const request = promisifyAgent(agent, Bluebird);

function main(context, done) {
    const { origin, target, comparator, value } = context.params;
    const compare = comparator === 'maior' ? gt : lt;

    if (origin === target) {
        return done({});
    }

    return request.get(`http://api.fixer.io/latest?base=${origin}`)
        .then(path(['body', 'rates', target]))
        .then(result => compare(result, value)
            ? [`${origin} valendo ${target} ${result.toFixed(2)}`]
            : {})
        .then(done)
        .catch(() => done({}));
}

const currencies = [
    'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR',
    'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW',
    'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK',
    'SGD', 'THB', 'TRY', 'USD', 'ZAR'
];

const params = {
    origin: {
        description: 'Moeda de origem',
        type: OneOf(currencies),
        default: 'USD'
    },
    target: {
        description: 'Moeda de destino',
        type: OneOf(currencies),
        default: 'BRL'
    },
    comparator: {
        description: 'Tipo de comparação',
        type: OneOf(['maior', 'menor']),
        default: 'menor'
    },
    value: {
        description: 'Valor de comparação',
        type: Money,
        default: 3.0
    }
};

const app = create(main, { params });

module.exports = app;
