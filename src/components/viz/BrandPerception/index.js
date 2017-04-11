import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import './BrandPerception.css';

class BrandPerception extends Component {
  componentDidMount() {
    const { h, w, padding,data } = this.props;
    const tip = d3Tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return `<strong>Rating:</strong> <span style='color:red'>
                     ${(d[1] * 100)}%</span>`;
                  });

    const svg = d3.select(this.svgContainer)
                  .append('svg')
                  .attr('height', h)
                  .attr('width', w);

    const formatPercent = d3.format(".0%");
    const yScale = d3.scaleLinear()
                     .domain([0, 1])
                     .range([h - padding, Number(padding)]);

    const colors = d3.scaleOrdinal(d3.schemeCategory10)
    const xDomain = this.props.data.map(d => d[0])
    const xScale = d3.scaleBand()
                     .domain(xDomain)
                     .range([Number(padding), w - padding])
                     .padding(0.5);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(formatPercent);

    svg.append('g')
       .attr('class', 'x axis')
       .attr('transform', `translate(0, ${ h - padding })`)
       .call(xAxis);

    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', `translate(${ padding }, 0)`)
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .attr("x", -padding)
       .style("text-anchor", "end")
       .style("fill", "whit#9c9c9c")
       .text("Rating");

    const graph = svg.append('g')
                     .style('position', 'relative');

    graph.call(tip);

    const bars = graph.selectAll('rect')
       .data(this.props.data)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('x', d => xScale(d[0]))
       .attr('y', yScale(0))
       .attr('width', xScale.bandwidth())
       .attr('height', 0)
       .style('fill', (d, i) => colors(i))
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);

    const labels = graph.selectAll('text')
                        .data(this.props.data)
                        .enter()
                        .append('text')
                        .attr('font-size', '11px')
                        .style('fill', 'white')
                        .attr('text-anchor', 'middle')
                        .attr('x', d => xScale(d[0]) + xScale.bandwidth() / 2)
                        .attr('y', d => yScale(0))
                        .text(d => formatPercent(d[1]))

    bars.transition()
        .duration(1000)
        .attr('y', d => yScale(d[1]))
        .attr('height', d => (h - padding) - yScale(d[1]));

    labels.transition()
          .duration(1000)
          .attr('y', d => Number(yScale(d[1])) + 15);

    console.log([h - padding, padding]);
  }

  render() {
    return (
      <div className="brand-perception">
        <div ref={ div => this.svgContainer = div }></div>
      </div>
    );
  }
}

export default BrandPerception;
