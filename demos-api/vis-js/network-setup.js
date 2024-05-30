// DOM element where the Network will be attached
var container = document.getElementById('network');

// Data for the nodes
var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

// Data for the edges
var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

// Provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

// Options for the network
var options = {
    edges: {
        smooth: {
            type: 'continuous'
        }
    },
    layout: {
        hierarchical: {
            direction: "UD", // Up-Down direction for hierarchical view
            sortMethod: 'directed'  // Directed graph layout
        }
    },
    physics: {
        enabled: false // Disable physics for stable layout
    }
};

// Initialize network!
var network = new vis.Network(container, data, options);
