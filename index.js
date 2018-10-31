import { create } from 'rung-sdk';
import { OneOf, Double } from 'rung-sdk/dist/types';
import Bluebird from 'bluebird';
import agent from 'superagent';
import promisifyAgent from 'superagent-promise';
import {
    gt,
    keys,
    lt,
    merge,
    path
} from 'ramda';

const request = promisifyAgent(agent, Bluebird);

const styles = {
    image: {
        width: '70px',
        height: '50px',
        float: 'left',
        marginTop: '16px',
        background: 'url(https://i.imgur.com/a0dpeTx.png) no-repeat',
        backgroundSize: 'contain',
        fontWeight: 'bolder',
        textAlign: 'left',
        paddingTop: '24px',
        color: '#333333'
    },
    label: {
        width: '24px',
        display: 'inline-block',
        textAlign: 'center'
    },
    text: {
        width: '60px',
        position: 'absolute',
        marginLeft: '79px',
        top: '50%',
        transform: 'translateY(-50%)'
    }
};

const currencies = {
    AUD: { name: _('Australian Dollar'), symbol: 'AU$' },
    BGN: { name: _('Bulgarian Lev'), symbol: 'BGN' },
    BRL: { name: _('Brazilian Real'), symbol: 'R$' },
    CAD: { name: _('Canadian Dollar'), symbol: 'CA$' },
    CHF: { name: _('Swiss Franc'), symbol: 'CHF' },
    CNY: { name: _('Chinese Yuan'), symbol: 'CN¥' },
    CZK: { name: _('Czech Republic Koruna'), symbol: 'Kč' },
    DKK: { name: _('Danish Krone'), symbol: 'Dkr' },
    EUR: { name: _('Euro'), symbol: '€' },
    GBP: { name: _('British Pound Sterling'), symbol: '£' },
    HKD: { name: _('Hong Kong Dollar'), symbol: 'HK$' },
    HRK: { name: _('Croatian Kuna'), symbol: 'kn' },
    HUF: { name: _('Hungarian Forint'), symbol: 'Ft' },
    IDR: { name: _('Indonesian Rupiah'), symbol: 'Rp' },
    ILS: { name: _('Israeli New Sheqel'), symbol: '₪' },
    INR: { name: _('Indian Rupee'), symbol: 'Rs' },
    JPY: { name: _('Japanese Yen'), symbol: '¥' },
    KRW: { name: _('South Korean Won'), symbol: '₩' },
    MXN: { name: _('Mexican Peso'), symbol: 'MX$' },
    MYR: { name: _('Malaysian Ringgit'), symbol: 'RM' },
    NOK: { name: _('Norwegian Krone'), symbol: 'Nkr' },
    NZD: { name: _('New Zealand Dollar'), symbol: 'NZ$' },
    PHP: { name: _('Philippine Peso'), symbol: '₱' },
    PLN: { name: _('Polish Zloty'), symbol: 'zł' },
    RON: { name: _('Romanian Leu'), symbol: 'RON' },
    RUB: { name: _('Russian Ruble'), symbol: 'RUB' },
    SEK: { name: _('Swedish Krona'), symbol: 'Skr' },
    SGD: { name: _('Singapore Dollar'), symbol: 'S$' },
    THB: { name: _('Thai Baht'), symbol: '฿' },
    TRY: { name: _('Turkish Lira'), symbol: 'TL' },
    USD: { name: _('US Dollar'), symbol: '$' },
    ZAR: { name: _('South African Rand'), symbol: 'R' }
};

function render(base, baseName, target, result) {
    return (
        <div>
            <div style={ styles.image }>
                <label
                    style={ merge(styles.label, {
                        fontSize: base.length > 2 ? '12px' : '19px',
                        marginLeft: '6px'
                    }) }>
                    { base }
                </label>
                <label
                    style={ merge(styles.label, {
                        fontSize: target.length > 2 ? '12px' : '19px',
                        marginLeft: '10px'
                    }) }>
                    { target }
                </label>
            </div>
            <div style={ styles.text }>
                { baseName }<br/>
                { `${_('at')} ${target} ${result}` }
            </div>
        </div>
    );
}

function renderAlert(base, target, result) {
    const baseCurrency = currencies[base].symbol;
    const baseName = currencies[base].name;
    const targetCurrency = currencies[target].symbol;
    const formattedResult = result.toString().replace('.', ',');
    return {
        [base + target]: {
            title: `${baseName} ${_('at')} ${targetCurrency} ${formattedResult}`,
            content: render(baseCurrency, baseName, targetCurrency, formattedResult),
            comment: `${baseName} ${_('at')} ${targetCurrency} ${formattedResult}`
        }
    };
}

function main(context, done) {
    const { base, target, comparator, value } = context.params;
    const compare = comparator === 'maior' ? gt : lt;
    const searchTerm = `${base}_${target}`;

    if (base === target) {
        return done({ alerts: {} });
    }

    return request.get('http://free.currencyconverterapi.com/api/v5/convert')
        .query({
            compact: 'y',
            q: searchTerm
        })
        .then(path(['body', searchTerm, 'val']))
        .then(result => compare(result, value)
            ? { alerts: renderAlert(base, target, result.toFixed(2)) }
            : { alerts: {} })
        .then(done)
        .catch(() => done({ alerts: {} }));
}

const params = {
    base: {
        description: _('Base currency'),
        type: OneOf(keys(currencies)),
        default: 'USD'
    },
    target: {
        description: _('Destination currency'),
        type: OneOf(keys(currencies)),
        default: 'BRL'
    },
    comparator: {
        description: _('Comparison type'),
        type: OneOf(['maior', 'menor']),
        default: 'menor'
    },
    value: {
        description: _('Comparison value'),
        type: Double,
        default: 6.0
    }
};

export default create(main, {
    params,
    primaryKey: true,
    title: _('Currency quotation'),
    description: _('Identify the best exchange opportunities!'),
    preview: render('$', currencies.USD.name, 'R$', '3,29')
});
