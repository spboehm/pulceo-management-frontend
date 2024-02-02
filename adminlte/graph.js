fetch("http://localhost:7878/internal/v1/g6/graph", {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
  },
})
 .then(res => res.json())
 .then(data => {
    const width = document.getElementById('container').scrollWidth;
    const height = document.getElementById('container').scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      linkCenter: true,
      // translate the graph to align the canvas's center, support by v3.5.1
      fitCenter: true,
      modes: {
        // 支持的 behavior
        default: ['drag-canvas'],
      },
      defaultEdge: {
        type: 'line',
        /* you can configure the global edge style as following lines */
        // style: {
        //   stroke: '#F6BD16',
        // },
        labelCfg: {
          autoRotate: true,
          refY: -10,
        },
      },
      /* styles for different states, there are built-in styles for states: active, inactive, selected, highlight, disable */
      // edgeStateStyles: {
      //   // edge style of active state
      //   active: {
      //     opacity: 0.5,
      //     stroke: '#f00'
      //   },
      //   // edge style of selected state
      //   selected: {
      //     stroke: '#ff0'
      //     lineWidth: 3,
      //   },
      // },
    });
    
    graph.data(data);
    graph.render();
    
    graph.on('edge:mouseenter', (evt) => {
      const { item } = evt;
      graph.setItemState(item, 'active', true);
    });
    
    graph.on('edge:mouseleave', (evt) => {
      const { item } = evt;
      graph.setItemState(item, 'active', false);
    });
    
    graph.on('edge:click', (evt) => {
      const { item } = evt;
      graph.setItemState(item, 'selected', true);
    });
    graph.on('canvas:click', (evt) => {
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge);
      });
    });
 })


