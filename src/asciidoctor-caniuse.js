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

function caniuseBlockMacro () {
  const self = this
  self.named('caniuse')
  self.positionalAttributes(['scope'])
  self.process((parent, target, attrs) => {
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
      const browserSupport = support[browserId]
      const browserName = browserNames[browserId] || browserId
      const latestStableVersion = latestStableBrowsers[browserId]
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
    return self.createBlock(parent, 'pass', `<div class="caniuse">${content.join('')}</div>`, attrs)
  })
}

const caniuseDocinfoProcessor = function () {
  const self = this
  self.process((doc) => {
    if (doc.getBackend() !== 'html5') {
      return ''
    }
    const style = `.caniuse {
  display: flex;
}

.browser {
  text-align: center;
  margin-right: 0.5rem;
  background-color: #fff;
  box-shadow: 0 2px 3px rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .1);
  color: #4a4a4a;
  max-width: 100%;
  position: relative;
  padding: 0.5rem 1rem;
}

.browser > .browser-name {
  padding-bottom: 0.5rem;
  font-weight: bold;
  size: 2rem;
}

.browser > .browser-support > div {
  margin: 0.1rem;
  padding: 0.2rem 1rem;
}

.browser > .browser-support > .browser-version {
  display: none;
}

.browser > .browser-support > .feat-supported {
  background-color: #23d160;
  color: #fff;
  font-weight: bold;
}

.browser > .browser-support > .feat-unsupported {
  background-color: #ff3860;
  color: #fff;
}

.browser-name > span {
  display: none;
}

.browser-name::before {
  display: block;
  content: ' ';
  background-size: 2rem 2rem;
  background-repeat: no-repeat;
  height: 2rem;
  width: 2rem;
  margin: auto auto .25rem;
}

.browser-name.browser-chrome::before {
  background: url('./node_modules/@browser-logos/chrome/chrome.svg');
}

.browser-name.browser-edge::before {
  background-image: url('./node_modules/@browser-logos/edge/edge.svg');
}

.browser-name.browser-firefox::before {
  background-image: url('./node_modules/@browser-logos/firefox/firefox.svg');
}

.browser-name.browser-opera::before {
  background-image: url('./node_modules/@browser-logos/opera/opera.svg');
}

.browser-name.browser-safari::before {
  background-image: url('./node_modules/@browser-logos/safari/safari.png');
}`
    return `<style type="text/css" class="caniuse-style">${style}</style>`
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(caniuseBlockMacro)
      this.docinfoProcessor(caniuseDocinfoProcessor)
    })
  } else if (typeof registry.blockMacro === 'function') {
    registry.blockMacro(caniuseBlockMacro)
    registry.docinfoProcessor(caniuseDocinfoProcessor)
  }
  return registry
}
