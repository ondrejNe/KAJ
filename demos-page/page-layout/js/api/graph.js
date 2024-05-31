
import {cssElementWidth, cssElementHeight } from "../util/css.js";

export const drawGraph = (element, nodes, links) => {
    d3.select(element).selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = {top: 40, right: 40, bottom: 40, left: 40},
        width = cssElementWidth(element.parentElement) - margin.left - margin.right,
        height = cssElementHeight(element.parentElement) - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.zoom().on("zoom", function (event) {
            svg.attr("transform", event.transform);
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
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "#999")
        .style("stroke", "none");

    // Initialize the links
    const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "#999")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrowhead)");
    console.log("Links added");

    // Initialize the nodes
    const node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", "#69b3a2")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    console.log("Nodes added");

    const text = svg
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("dy", -10)
        .text(d => d.name);
    console.log("Text added");

    // Let's list the force we want to apply on the network
    const simulation = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink(links)               // This force provides links between nodes
            .id(function (d) {
                return d.id;
            })                  // This provides the id of a node
        )
        .force("charge", d3.forceManyBody().strength(-100))           // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        .on("tick", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        text
            .attr("x", function (d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    console.log("Draw finished");
};
