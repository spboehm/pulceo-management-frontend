fetch("http://localhost:7878/api/v1/resources/cpus", {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
  },
})
 .then(res => res.json())
 .then(data => {
    const template = document.querySelector('#resources-cpu')
    const result = document.querySelector('#resources-cpu-result')
    const engine = new liquidjs.Liquid()
    
    engine
        .parseAndRender(template.innerHTML, {cpus: data})
        .then(html => result.innerHTML = html)
 });