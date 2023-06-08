const styles = require('./sweet-alert.css.js')
    , define = require('@compone/define')
    , style  = require('@compone/style')
    , once   = require('utilise/once')
    , time   = require('utilise/time')
    , def    = require('utilise/def')

module.exports = define('sweet-alert', function swal(node, state){
  style(node, styles)
  const o = once(node)
      , m = o('.modal', 1)
      , { exiting = false
        , title = ''
        , content = ''
        , type = 'warning'
        , visible = title || content ? true : false
        , buttons = [{ type: 'primary', text: 'Close' }] } = state

  o(window)
    .on('keydown.escape', keydown)

  o.classed('exiting', exiting)
   .classed('visible', visible)
    ('.overlay', 1, null, '.modal')

  m('.icon', 1)
    .classed('question', type == 'question')
    .classed('success', type == 'success')
    .classed('working', type == 'working')
    .classed('warning', type == 'warning')
    .classed('loading', type == 'loading')
    .classed('error', type == 'error')
    .classed('info', type == 'info')

  m('.title', 1)
    .text(title)

  m('.content', 1)
    .html(content)

  m('button', buttons)
    .text(d => d.text)
    .attr('class', d => d.type)
    .on('click.default', (e, d, el) => (d.onClick || close)(e, d, el))

  function close() {
    state.exiting = true
    o.draw()
    time(410, d => {
      for (let prop in state) delete state[prop]
      o.draw()
    })
  }

  function show({ title, content, type, buttons } = {}) {
    state.title = title
    state.content = content
    state.type = type
    state.buttons = buttons
    state.visible = true
    return node.render() // TODO: change all draws
  }

  function keydown({ key }) {
    if (key == 'Escape') close()
  }
  
  def(node, close)
  def(node, show)
})