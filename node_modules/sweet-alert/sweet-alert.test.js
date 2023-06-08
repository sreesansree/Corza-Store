const { test } = require('tap')
    , { spawn } = require('spawn-client')
    
test('should show warning dialog', spawn('<sweet-alert id="swal">', async () => {
  await swal.render()
  await swal.show({ 
    type: 'warning'
  , title: 'some title'
  , content: 'some <b>html</b> content'
  , buttons: [{ text: 'close', type: 'primary' }] 
  })

  same(swal, `
    <sweet-alert id="swal" stylesheet="721980191" class="visible">
      <div class="overlay"></div>
      <div class="modal">
        <div class="icon warning"></div>
        <div class="title">some title</div>
        <div class="content">some <b>html</b> content</div>
        <button class="primary">close</button>
      </div>
    </sweet-alert>
  `)
}))