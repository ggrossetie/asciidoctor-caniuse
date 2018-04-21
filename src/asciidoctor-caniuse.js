const caniuse = require('caniuse-api')

const browserNames = {
  baidu: 'Baidu',
  edge: 'Edge',
  chrome: 'Chrome',
  android: 'Android',
  and_chr: 'Chrome Android',
  ie: 'IE',
  firefox: 'Firefox',
  and_ff: 'Firefox Android',
  op_mini: 'Opera mini',
  ie_mob: 'IE Mobile',
  op_mob: 'Opera Mobile',
  and_qq: 'QQ',
  samsung: 'Samsung Internet',
  and_uc: 'UC for Android',
  bb: 'Blackberry',
  ios_saf: 'iOS Safari',
  safari: 'Safari',
  opera: 'Opera'
}

function caniuseInlineMacro () {
  this.named('caniuse')
  this.positionalAttributes(['scope'])
  this.process((parent, target, attrs) => {
    const scope = Opal.hash_get(attrs, 'scope') || 'defaults'
    caniuse.setBrowserScope(scope)
    const support = caniuse.getSupport(target)
    const content = Object.keys(support).map(function (browserId) {
      let browserSupport = support[browserId];
      let browserName = browserNames[browserId] || browserId;
      const infos = [];
      if (browserSupport.n) {
        infos.push({classes: 'feat-unsupported', value: browserSupport.n})
      }
      if (browserSupport.x) {
        infos.push({classes: 'feat-prefixed', value: browserSupport.x})
      }
      if (browserSupport.a) {
        infos.push({classes: 'feat-partially-supported', value: browserSupport.a})
      }
      if (browserSupport.y) {
        infos.push({classes: 'feat-supported', value: browserSupport.y})
      }
      return `<div class="browser">
  <div class="browser-name">${browserName}</div>
  <div class="browser-support">
    ${infos.map((info) => `<div class="${info.classes}">${info.value}</div>`).join('')}
  </div>
</div>`
    })
    return `<div class="caniuse">${content.join('')}</div>`
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
