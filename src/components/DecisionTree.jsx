import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from "radium"
import "./DecisionTree.css"
class DecisionTree extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

        var treeData = { "name": "OverTime", "split": "No", "left": "=", "right": "=", "children": [{ "name": "Age", "split": "21.5", "left": ">=", "right": "<", "children": [{ "name": "leaf", "yes": 61, "no": 618 }, { "name": "DailyRate", "split": "623.5", "left": ">=", "right": "<", "children": [{ "name": "leaf", "yes": 2, "no": 10 }, { "name": "leaf", "yes": 9, "no": 2 }] }] }, { "name": "MonthlyIncome", "split": "3485", "left": ">=", "right": "<", "children": [{ "name": "JobRole", "split": "Healthcare Representative,Manager,Manufacturing Director,Research Director,Research Scientist", "left": "=", "right": "=", "children": [{ "name": "leaf", "yes": 12, "no": 104 }, { "name": "MaritalStatus", "split": "Divorced,Married", "left": "=", "right": "=", "children": [{ "name": "leaf", "yes": 10, "no": 44 }, { "name": "MonthlyIncome", "split": "4724.5", "left": "<", "right": ">=", "children": [{ "name": "leaf", "yes": 1, "no": 6 }, { "name": "JobSatisfaction", "split": "3.5", "left": ">=", "right": "<", "children": [{ "name": "leaf", "yes": 3, "no": 5 }, { "name": "leaf", "yes": 12, "no": 1 }] }] }] }] }, { "name": "StockOptionLevel", "split": "0.5", "left": ">=", "right": "<", "children": [{ "name": "BusinessTravel", "split": "Non-Travel,Travel_Rarely", "left": "=", "right": "=", "children": [{ "name": "TrainingTimesLastYear", "split": "2.5", "left": ">=", "right": "<", "children": [{ "name": "leaf", "yes": 1, "no": 15 }, { "name": "HourlyRate", "split": "66", "left": ">=", "right": "<", "children": [{ "name": "leaf", "yes": 1, "no": 7 }, { "name": "leaf", "yes": 9, "no": 4 }] }] }, { "name": "leaf", "yes": 8, "no": 3 }] }, { "name": "DistanceFromHome", "split": "9.5", "left": "<", "right": ">=", "children": [{ "name": "EducationField", "split": "Life Sciences,Medical", "left": "=", "right": "=", "children": [{ "name": "leaf", "yes": 7, "no": 11 }, { "name": "leaf", "yes": 13, "no": 2 }] }, { "name": "leaf", "yes": 18, "no": 1 }] }] }] }] }


        this.draw(treeData)
    }
    draw(treeData) {
        var margin_width = 150
        var margin_height = 50
        var width = 1500 - margin_width
        var height = 500 - margin_height
        var svg = d3.select(".decisiontree")
            .append("svg")
            .attr("width", width + margin_width)
            .attr("height", height + margin_height)
            .append("g")
            .attr("transform", "translate("
            + margin_width + "," + margin_height + ")");

        var i = 0,
            duration = 750,
            root;

        var treemap = d3.tree().size([height, width])

        root = d3.hierarchy(treeData, d => d.children)
        root.x0 = height / 2
        root.y0 = 0

        root.children.forEach(collapse)
        update(root)
        function collapse(d) {
            if (d.children) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }
        function update(source) {

            // Assigns the x and y position for the nodes
            var treeData = treemap(root);

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 180 });

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function (d) { return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("x", function (d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    if (d.data.name == "leaf") {
                        return "Left: " + d.data.yes + " , Not Left: " + d.data.no
                    }
                    return d.data.name + " " + d.data.left + " " + d.data.split;
                });

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 10)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                })
                .attr('cursor', 'pointer');


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = svg.selectAll('path.link')
                .data(links, function (d) { return d.id; });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                    var o = { x: source.x0, y: source.y0 }
                    return diagonal(o, o)
                });

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) { return diagonal(d, d.parent) });

            // Remove any exiting links
            var linkExit = link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                    var o = { x: source.x, y: source.y }
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {

                 var path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

                return path
            }

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }
        }
    }
    render() {
        return (
            <div>
                <div className="decisiontree">
                    
                </div>
            </div>
        )
    }
}

export default DecisionTree