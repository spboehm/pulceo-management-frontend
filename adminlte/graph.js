import { Client } from '@stomp/stompjs';

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
      animate: true, // Boolean, whether to activate the animation when global changes happen
      animateCfg: {
        duration: 500, // Number, the duration of one animation
        easing: 'linearEasing', // String, the easing function
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

    G6.registerEdge(
      'updateEdge',
      {
        afterDraw(cfg, group) {
          // Get the first graphics shape of this type of edge, which is the edge's path
          const shape = group.get('children')[0];
          // The start point of the edge's path
          const startPoint = shape.getPoint(0);
    
          // Add a red circle shape
          const circle = group.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: 'red',
              r: 3,
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'circle-shape',
          });
    
          // Add the animation to the red circle
          circle.animate(
            (ratio) => {
              // Returns the properties for each frame. The input parameter ratio is a number that range from 0 to 1. The return value is an object that defines the properties for this frame
              // Get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // Return the properties of this frame, x and y for this demo
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Play the animation repeatly
              duration: 3000, // The duration for one animation
            },
          );
        },
      },
      'updateEdge',
    ); // Extend the built-in edge cubic
    
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

    const client = new Client({
      brokerURL: 'ws://localhost:7777/ws',
      onConnect: () => {
          client.subscribe('/metrics/+', message =>
            updateEdge(graph, message)
          );
          client.publish({ destination: '/pms/register', body: 'First Message' });
      },
    });
    client.activate();
    
    function updateEdge(graph, message) {
      const messageAsJson = JSON.parse(message.body);
      const data = {
        label: messageAsJson.value + " " + messageAsJson.unit,
        type: 'updateEdge'
      }
      const item = graph.findById(messageAsJson.linkUUID)
      graph.updateItem(item, data);
    }


    function my(graph, message, id) {
      const model = {
        id: '5',
        label: 'd52bb935-533c-4c39-8cc3-df0e2305eb1d',
        source: '69fd0da6-fd41-41d0-b052-d2943ecc5024',
        target: '379da2f7-c575-4466-9e4e-8e0e2d741433',
        label: message,
        curveOffset: 50,
        type: 'arc'
      };
      graph.addItem('edge', model);


      const model2 = {
        id: '6',
        label: 'd52bb935-533c-4c39-8cc3-df0e2305eb1d',
        source: '379da2f7-c575-4466-9e4e-8e0e2d741433',
        target: '69fd0da6-fd41-41d0-b052-d2943ecc5024',
        label: message,
        curveOffset: 50,
        type: 'arc'
      };
      graph.addItem('edge', model2);
     }
 })
