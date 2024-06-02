import { d3SvgFoundation } from "./d3Common.js";

export const d3TreeDraw = (element, data) => {
    // Prepare the element container
    const common = d3SvgFoundation(element);
    const svg = common.svg;
    const width = common.width;
    const height = common.height;
    const margin = common.margin;

    // Remove default double-click zoom behavior
    svg.call(d3.zoom().on("zoom", null));

    // Define arrow markers
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#28283b');

    // Create a root node from the data
    const root = d3.hierarchy(data);
    root.x0 = width / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children; // Collapse children
        if (d.depth) d.children = null; // Initial collapse
    });

    // Create a tree layout
    const tree = d3.tree()
        .size([width, height])
        .separation((a, b) => a.parent === b.parent ? 1 : 1.5); // Set separation between nodes

    // Define a diagonal projection for links
    const diagonal = d3.linkVertical().x(d => d.x).y(d => d.y);

    // Create groups for links and nodes
    const gLink = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#28283b')
        .attr('stroke-opacity', 1.0)
        .attr('stroke-width', 2.0);

    const gNode = svg.append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all');

    // Function to update the tree
    function update(event, source) {
        const duration = event && event.altKey ? 2500 : 250; // Set transition duration
        const nodes = root.descendants().reverse(); // Get all nodes
        const links = root.links(); // Get all links

        tree(root); // Compute the new tree layout

        // Calculate the height of the tree
        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.y < left.y) left = node;
            if (node.y > right.y) right = node;
        });

        const newHeight = right.y - left.y + margin.top + margin.bottom;

        const transition = svg.transition()
            .duration(duration)
            .attr('height', newHeight)
            .attr('viewBox', [-margin.left, left.y - margin.top, width + margin.right, newHeight + margin.bottom])
            .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

        // Update the nodes
        const node = gNode.selectAll('g')
            .data(nodes, d => d.id);

        // Enter new nodes
        const nodeEnter = node.enter().append('g')
            .attr('transform', _ => `translate(${source.x0},${source.y0})`)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .on('dblclick', (event, d) => {
                d.children = d.children ? null : d._children; // Toggle children on double-click
                update(event, d); // Update tree
            });

        // Calculate text dimensions and create rectangles based on them
        nodeEnter.each(function(d) {
            const node = d3.select(this);
            const text = node.append('text')
                .attr('y', 0)
                .attr('x', 0)
                .attr('text-anchor', 'middle')
                .attr('fill', '#28283b')
                .attr('style', 'font-size: 12px; font-family: sans-serif; pointer-events: none;')
                .each(function(d) {
                    const lines = d.data.data !== null
                        ? [d.data.name, d.data.data.timeSeriesId]
                        : [d.data.name];

                    lines.forEach((line, i) => {
                        d3.select(this).append('tspan')
                            .attr('x', 0)
                            .attr('dy', i === 0 ? '0em' : '1.2em')
                            .text(line);
                    });
                });

            const bbox = text.node().getBBox();
            const fillColor = d.data.data && d.data.data.timeSeriesId ? '#28aa82' : '#ffffff';
            node.insert('rect', 'text')
                .attr('x', bbox.x - 10)
                .attr('y', bbox.y - 5)
                .attr('width', bbox.width + 20)
                .attr('height', bbox.height + 10)
                .attr('fill', fillColor)
                .attr('stroke', '#28283b')
                .attr('stroke-width', 2)
                .attr('pointer-events', 'all');

            // Store the size for later use
            d.bbox = bbox;
        });

        // Update the positions of the nodes
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1);

        // Remove exiting nodes
        const nodeExit = node.exit().transition(transition).remove()
            .attr('transform', _ => `translate(${source.x},${source.y})`)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0);

        // Update the links
        const link = gLink.selectAll('path')
            .data(links, d => d.target.id);

        // Enter new links
        const linkEnter = link.enter().append('path')
            .attr('d', _ => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            })
            .attr('marker-end', 'url(#arrow)'); // Add the marker to the start of the link

        // Update link positions
        link.merge(linkEnter).transition(transition)
            .attr('d', d => {
                const source = { x: d.source.x, y: d.source.y + 30 };
                const target = { x: d.target.x, y: d.target.y - 30 };
                return diagonal({ source, target });
            })
            .attr('marker-end', 'url(#arrow)'); // Add the marker to the start of the link

        // Remove exiting links
        link.exit().transition(transition).remove()
            .attr('d', _ => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Stash the old positions for transition
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Initialize the tree with the root node
    update(null, root);
};
