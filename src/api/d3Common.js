
import { cssElementFreeWidth, cssElementFreeHeight } from "../util/css.js";

export const d3SvgFoundation = (element) => {
    // Remove any existing elements in the container
    d3.select(element).selectAll("*").remove();

    // Set the dimensions and margins of the future graph
    const margin = { top: 40, right: 40, bottom: 40, left: 40 },
        width = cssElementFreeWidth(element.parentElement) - margin.left - margin.right,
        height = cssElementFreeHeight(element.parentElement) - margin.top - margin.bottom;

    // Append an SVG element to the container
    const svg = d3.select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.zoom().on("zoom", (event) => {
            svg.attr("transform", event.transform); // Enable zooming and panning
        }))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    return {
        svg: svg,
        width: width,
        height: height,
        margin: margin
    };
};
