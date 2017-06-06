import { create } from 'rung-sdk';
import { OneOf, Money } from 'rung-sdk/dist/types';
import Bluebird from 'bluebird';
import agent from 'superagent';
import promisifyAgent from 'superagent-promise';
import { path, lt, gt } from 'ramda';

const request = promisifyAgent(agent, Bluebird);

function renderAlert(origin, target, result) {
    return [{
        title: `${origin} ${_('worth')} ${target} ${result}`,
        content: `${origin} ${_('worth')} ${target} ${result}`,
        comment: `${origin} ${_('worth')} ${target} ${result}`
    }];
}

function main(context, done) {
    const { origin, target, comparator, value } = context.params;
    const compare = comparator === 'maior que' ? gt : lt;

    if (origin === target) {
        return done({});
    }

    return request.get(`http://api.fixer.io/latest?base=${origin}`)
        .then(path(['body', 'rates', target]))
        .then(result => compare(result, value)
            ? { alerts: renderAlert(origin, target, result.toFixed(2)) }
            : { alerts: {} })
        .then(done)
        .catch(() => done({ alerts: {} }));
}

const currencies = [
    'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR',
    'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW',
    'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK',
    'SGD', 'THB', 'TRY', 'USD', 'ZAR'
];

const params = {
    origin: {
        description: _('Currency of origin'),
        type: OneOf(currencies),
        default: 'USD'
    },
    target: {
        description: _('Currency of destination'),
        type: OneOf(currencies),
        default: 'BRL'
    },
    comparator: {
        description: _('Comparison type'),
        type: OneOf(['maior que', 'menor que']),
        default: 'menor que'
    },
    value: {
        description: _('Comparison value'),
        type: Money,
        default: 3.0
    }
};

export default create(main, { params });
