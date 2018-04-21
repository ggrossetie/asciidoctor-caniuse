const assert = require('assert')

const caniuseExtension = require('../src/asciidoctor-caniuse.js')
const asciidoctor = require('asciidoctor.js')()

const registry = caniuseExtension.register(asciidoctor.Extensions.create())

describe('Asciidoctor caniuse extension', function () {
  it('should create a support table', function () {
    asciidoctor.convert('caniuse:battery-status[]', {extension_registry: registry})
  });
});
