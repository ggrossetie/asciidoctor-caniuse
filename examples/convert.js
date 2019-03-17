const asciidoctor = require('asciidoctor.js')()
const caniuseExtension = require('../src/asciidoctor-caniuse.js')
const registry = caniuseExtension.register(asciidoctor.Extensions.create())

asciidoctor.convertFile('sample.adoc', { safe: 'safe', extension_registry: registry })
