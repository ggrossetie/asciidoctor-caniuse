const caniuse = require('caniuse-api')

function caniuseInlineMacro () {
  this.named('caniuse')
  this.process((parent, target, attrs) => {
    const support = caniuse.getSupport(target, true)
    const browserNames = [];
    const cells = [];
    Object.keys(support).map(function (browserId) {
      let browserSupport = support[browserId];
      browserNames.push(browserId); // get browser name
      if (browserSupport.y) {
        cells.push({classes: 'caniuse-feat-supported green-background white', value: browserSupport.y})
      } else if (browserSupport.n) {
        cells.push({classes: 'caniuse-feat-unsupported red-background white', value: browserSupport.n})
      } else if (browserSupport.a) {
        cells.push({classes: 'caniuse-feat-partially-supported yellow-background', value: browserSupport.a})
      } else if (browserSupport.x) {
        cells.push({classes: 'caniuse-feat-prefixed olive-background white', value: browserSupport.x})
      }
    })
    return `<table>
  <thead>
    <tr>
      ${browserNames.map((name) => `<th>${name}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    <tr>${cells.map((cell) => `<td class="${cell.classes}">${cell.value}</td>`).join('')}</tr>
  </tbody>
</table>`
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.inlineMacro(caniuseInlineMacro)
    })
  } else if (typeof registry.block === 'function') {
    registry.inlineMacro(caniuseInlineMacro)
  }
  return registry
}
