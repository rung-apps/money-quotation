const chai = require('chai');
const { all } = require('bluebird');

chai.use(require('chai-json-schema'));
const { expect } = chai;

const data = [
    {
        base: 'USD',
        target: 'BRL',
        comparator: 'menor',
        value: 10.0
    }
];

const schema = {
    required: ['alerts'],
    properties: {
        alerts: {
            type: 'object',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'object',
                required: ['title', 'content', 'comment']
            }
        }
    }
};

test('Success in the searches', app =>
    app({ params: data[0] })
        .then(result => {
            expect(result).to.be.jsonSchema(schema);
        })
);

test('The success searches should always return an alert', app =>
    app({ params: data[0] })
        .then(result => {
            expect(result.alerts).to.not.be.empty;
        })
);
