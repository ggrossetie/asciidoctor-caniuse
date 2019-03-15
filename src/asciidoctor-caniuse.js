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
    const scope = attrs.scope || 'last 1 Chrome versions,last 1 Firefox versions,last 1 Edge versions,last 1 Safari versions,last 1 Opera versions'
    caniuse.setBrowserScope(scope)
    const support = caniuse.getSupport(target)
    const latestStableBrowsers = caniuse.getLatestStableBrowsers()
      .map((value) => {
        const parts = value.split(' ')
        return { id: parts[0], version: parts[1] }
      })
      .reduce((json, value) => {
        json[value.id] = value.version
        return json
      }, {})
    const content = Object.keys(support).map(function (browserId) {
      let browserSupport = support[browserId]
      let browserName = browserNames[browserId] || browserId
      let latestStableVersion = latestStableBrowsers[browserId]
      const infos = []
      if (browserSupport.n) {
        infos.push({ classes: 'browser-version feat-unsupported', value: browserSupport.n })
      }
      if (browserSupport.x) {
        infos.push({ classes: 'browser-version feat-prefixed', value: browserSupport.x })
      }
      if (browserSupport.a) {
        infos.push({ classes: 'browser-version feat-partially-supported', value: browserSupport.a })
      }
      if (browserSupport.y) {
        infos.push({ classes: 'browser-version feat-supported', value: browserSupport.y })
      }
      if (latestStableVersion) {
        let support = 'feat-unsupported'
        if (browserSupport.n && browserSupport.n > browserSupport.y) {
          // not supported anymore
        } else if (browserSupport.y && latestStableVersion >= browserSupport.y) {
          // supported on the latest stable version
          support = 'feat-supported'
        }
        infos.push({ classes: `browser-latest-stable-version ${support}`, value: latestStableVersion })
      }
      return `<div class="browser">
  <div class="browser-name browser-${browserId}"><span>${browserName}</span></div>
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
