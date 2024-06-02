import { cssElementWidth, cssElementHeight } from "../util/css.js";

export const d3GraphDraw = (element, nodes, links) => {
    // Remove any existing elements in the container
    d3.select(element).selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 40, right: 40, bottom: 40, left: 40 },
        width = cssElementWidth(element.parentElement) - margin.left - margin.right,
        height = cssElementHeight(element.parentElement) - margin.top - margin.bottom;

    // Append an SVG element to the container
    const svg = d3.select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.zoom().on("zoom", function (event) {
            svg.attr("transform", event.transform); // Enable zooming and panning
        }))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define arrow markers for links
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 13)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5") // Define the arrow shape
        .attr("fill", "#999")
        .style("stroke", "none");

    // Initialize the links
    const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "#28283b")
        .attr('stroke-opacity', 1.0)
        .attr('stroke-width', 2.0)
        .attr("marker-end", "url(#arrowhead)"); // Add arrow markers to the links

    // Initialize the nodes
    const node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", "#28aa82")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Add text labels to the nodes
    const text = svg
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("dy", -10)
        .attr("text-anchor", "middle")
        .attr("fill", "#28283b")
        .attr('style', 'font-size: 12px; font-family: sans-serif;')
        .text(d => d.name);

    // Define the force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links) // Link force to create links between nodes
            .id(d => d.id) // Use the node's id as the identifier
            .distance(500) // Set distance between nodes
        )
        .force("charge", d3.forceManyBody().strength(-300)) // Repulsion force between nodes
        .force("center", d3.forceCenter(width / 2, height / 2)) // Centering force
        .on("tick", ticked); // Update positions on each tick

    // Update positions of nodes and links on each tick
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    // Functions to handle drag events
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart(); // Activate simulation
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0); // Deactivate simulation
        d.fx = null;
        d.fy = null;
    }
};
