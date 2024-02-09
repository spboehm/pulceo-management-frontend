fetch("http://localhost:7878/api/v1/resources/memory", {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
  },
})
 .then(res => res.json())
 .then(data => {
    const template = document.querySelector('#resources-memory')
    const result = document.querySelector('#resources-memory-result')
    const engine = new liquidjs.Liquid()
    
    engine
        .parseAndRender(template.innerHTML, {memory: data})
        .then(html => result.innerHTML = html)
 });