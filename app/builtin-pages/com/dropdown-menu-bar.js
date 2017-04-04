import * as yo from 'yo-yo'

// exported api
// =

export default function render (state, menu) {
  if (!state.toplevelClickHandler) {
    state.toplevelClickHandler = onToplevelClick(state, menu)
    window.addEventListener('click', state.toplevelClickHandler)
  }

  return yo`
    <div class="dropdown-menu-bar ${state.active ? 'active' : ''}">
      ${menu.map((item, i) => rTopItem(state, menu, item, i))}
    </div>
  `
}

// rendering
// =

function update (state, menu) {
  yo.update(document.querySelector('.dropdown-menu-bar'), render(state, menu))
}

function rTopItem (state, menu, item, index) {
  const onMouseOver = e => onHoverTopItem(state, menu, index)
  const onClick = e => onClickTopItem(state, menu, index, e)

  if (!state.active || state.openedMenuIndex !== index) {
    return yo`
      <div class="item top-item closed" onclick=${onClick} onmouseover=${onMouseOver}>${item.label}</div>
    `
  }

  return yo`
    <div class="item top-item open" onclick=${onClick} onmouseover=${onMouseOver}>
      ${item.label}
      <div class="dropdown-menu">
        ${item.menu.map(subItem => rMenuItem(state, subItem))}
      </div>
    </div>
  `
}

function rMenuItem (state, item) {
  if (item === '-') {
    return yo`<hr />`
  }
  var cls = ''
  if (item.disabled) cls = 'disabled'
  return yo`
    <a class=${cls}>${rLabel(item.label)}</a>
  `
}

function rLabel (str) {
  var parts = str.split('&')
  if (parts.length === 1) return str // no change

  // pull out the character after the &
  var ch = parts[1].charAt(0)
  parts[1] = parts[1].slice(1)

  // add an underlined element
  parts.splice(1, 0, yo`<u>${ch}</u>`)
  return parts
}

// events
// =

function onClickTopItem (state, menu, index, e) {
  if (!state.active) {
    e.stopPropagation()

    state.active = true
    state.openedMenuIndex = index
    update(state, menu)
  }
}

function onHoverTopItem (state, menu, index) {
  if (state.active && state.openedMenuIndex !== index) {
    state.openedMenuIndex = index
    update(state, menu)
  }
}

function onToplevelClick (state, menu) {
  return e => {
    if (!state.active) return
    state.active = false
    update(state, menu)
  }
}