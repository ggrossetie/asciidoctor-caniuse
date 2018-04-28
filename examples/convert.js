const asciidoctor = require('asciidoctor.js')()
const caniuseExtension = require('../src/asciidoctor-caniuse.js')
const registry = caniuseExtension.register(asciidoctor.Extensions.create())

asciidoctor.convertFile('sample.adoc', {safe: 'safe', header_footer: true, extension_registry: registry})