fetch("http://localhost:7878/api/v1/nodes", {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
  },
})
 .then(res => res.json())
 .then(data => {
  console.log(data)
    const template = document.querySelector('[type="text/template"]')
    const result = document.querySelector('#result')
    const engine = new liquidjs.Liquid()
    
    engine
        .parseAndRender(template.innerHTML, {nodes: data})
        .then(html => result.innerHTML = html)
 });