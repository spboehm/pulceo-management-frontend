fetch("http://localhost:7878/api/v1/nodes", {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
  },
})
 .then(res => res.json())
 .then(data => {
    const template = document.querySelector('#nodes')
    const result = document.querySelector('#nodes-result')
    const engine = new liquidjs.Liquid()
    
    engine
        .parseAndRender(template.innerHTML, {nodes: data})
        .then(html => result.innerHTML = html)
 });