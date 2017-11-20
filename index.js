const D3Node = require('d3-node');
const D3Sankey = require('d3-plugins-sankey');

const defaultContainer = `
<div id="container">
  <h2> Chart</h2>
  <div id="chart"></div>
</div>`;

const defaultStyle = `.polygons {stroke: #000;}`;

function sankey (data, selector = '#chart', container = defaultContainer, styles = defaultStyle/*, options*/) {
  var d3n = new D3Node({
    selector,
    container,
    styles
  });

  const d3 = d3n.d3;

  // adapted from: http://bl.ocks.org/mbostock/4060366 - sankey
  ///-- start D3 code

  const width = 960;
  const height = 500;

  const svg = d3n.createSVG(width, height);

  const formatNumber = d3.format(",.0f"),
      format = function(d) { return formatNumber(d) + " TWh"; },
      color = d3.scaleOrdinal(d3.schemeCategory10);

  let sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]])
      .iterations(256)

  let link = svg.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
    .selectAll("path");

  let node = svg.append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g");



    // create hash of nodes
    var nodeHash = {};
    data.nodes.forEach(function(d){
        nodeHash[d.name] = d;
    });
    // loop links and swap out string for object
    data.links.forEach(function(d){
        d.source = nodeHash[d.source];
        d.target = nodeHash[d.target];
    });

  sankey(data);

  link = link
    .data(data.links)
    .enter().append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  node = node
    .data(data.nodes)
    .enter().append("g");

  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
      .attr("stroke", "#000");

  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

  node.append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });


  /// -- end D3 code

  return d3n;
}

module.exports = sankey;
