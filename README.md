### Cotação de moeda

Rung &lt;suporte@rung.com.br&gt;

[![Deploy to Rung](https://i.imgur.com/uijt57R.png)](https://app.rung.com.br/deploy)

![rung-cli 0.2.6](https://img.shields.io/badge/rung--cli-0.2.6-blue.svg?style=flat-square)
![money-quotation 1.0.0](https://img.shields.io/badge/money--quotation-1.0.0-green.svg?style=flat-square)

Conversão de moedas baseado no valor da cotação atual

#### Parameters

|Parameter | Type | Description |
|----------|------|-------------|
| `origin` | `OneOf([AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HKD, HRK, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, SGD, THB, TRY, USD, ZAR])` | Moeda de origem |
| `target` | `OneOf([AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HKD, HRK, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, SGD, THB, TRY, USD, ZAR])` | Moeda de destino |
| `comparator` | `OneOf([maior, menor])` | Tipo de comparação |
| `value` | `Money` | Valor de comparação |

<img align="left" width="256" src="./icon.png" />

##### Dependencies

- `bluebird`: `^3.4.7`
- `ramda`: `^0.23.0`
- `rung-sdk`: `^1.0.6`
- `superagent`: `^3.5.0`
- `superagent-promise`: `^1.1.0`

