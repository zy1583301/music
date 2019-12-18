const myStyle = document.createElement('div').style

let vendor = function () {
  const styleObj = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in styleObj) {
    if (myStyle[styleObj[key]] !== undefined) {
      return key
    }
  }
  return false
}
export function prefixStyle (style) {
  if (vendor() === false) {
    return false
  }

  if (vendor() === 'standard') {
    return style
  }

  return vendor() + style.charAt(0).toUpperCase() + style.substr(1)
}
