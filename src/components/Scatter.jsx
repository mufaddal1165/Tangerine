import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from 'radium'
import { tooltipGen, axisLineGen, orderListLV } from './subroutines.js'

class Scatter extends Component {

    constructor(props) {
        super(props)

    }
    componentDidMount() {

        var attr1 = this.props.attr1;
        var attr2 = this.props.attr2;
        var attr3 = this.props.attr3;

        d3.request(`http://localhost:8000/api/scatter?x=${attr1}&y=${attr2}&z=${attr3}`)
            .mimeType('application/json')
            .response(xhr => JSON.parse(xhr.responseText))
            .get(data => this.draw(data))

    }
    draw(data) {
        var margin = 90
        var width = this.props.w - margin
        var height = this.props.h - margin
        var distinct_attr3 = orderListLV((d3.map(data, d => d.attr3).keys()))
        var colorGen = d3.scaleQuantize().range(distinct_attr3).domain([0, 1])
        var radius = (width + height) / 200
        var svg = d3.select('.scatter')
            .append('svg')
            .attr('height', height + margin)
            .attr('width', width + margin)
        console.log(data)
        var x_extent = d3.extent(data.map(d => d.attr1))
        var y_extent = d3.extent(data.map(d => d.attr2))

        var xScale = d3.scaleLinear().range([margin, width]).domain(x_extent)
        var yScale = d3.scaleLinear().range([height, margin]).domain(y_extent)


        d3.select('.scatter')
            .select('svg')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')

        d3.selectAll('circle')
            .attr('cx', d => xScale(d.attr1))
            .attr('cy', d => yScale(d.attr2))
            .attr('r', radius)
            .attr('fill', d => {
                let ub = colorGen.invertExtent(d.attr3)
                return d3.interpolateViridis(ub[1])
            })

        var xAxis = d3.axisBottom(xScale).ticks(20)
        var yAxis = d3.axisLeft(yScale).ticks(20)

        d3.select('.scatter')
            .select('svg')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height + 5})`)
            .call(xAxis)

        d3.select('.scatter')
            .select('svg')
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${margin - 10},0)`)
            .call(yAxis)

        var tooltip = tooltipGen('scatter')

        var axisLine = d3.select('.scatter').select('svg').append('line')
            .attr('class', 'xl axisLine')
            .style('stroke', 'rgb(0,0,0)')
            .style('stroke-width', 1)
            .style('opacity', 0)

        var axisLine2 = d3.select('.scatter').select('svg').append('line')
            .attr('class', 'yl axisLine')
            .style('stroke', 'rgb(0,0,0)')
            .style('stroke-width', 1)
            .style('opacity', 0)

        d3.selectAll('circle')
            .on('mouseover', (d) => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0.7)
                // console.log(d.attr1)
                tooltip.text(`${this.props.attr1}: ${d.attr1} 

                ${this.props.attr2}: ${d.attr2} 
                
                ${this.props.attr3}: ${d.attr3}
                
                `)
                    .style('left', (xScale(d.attr1) + 5) + 'px')
                    .style('top', (yScale(d.attr2) + 5) + 'px')

                axisLine.transition()
                    .duration(500)
                    .attr('x1', xScale(d.attr1))
                    .attr('x2', xScale(d.attr1))
                    .attr('y1', yScale(d.attr2))
                    .attr('y2', height + 5)
                    .style('opacity', 0.8)

                axisLine2.transition()
                    .duration(500)
                    .attr('x1', margin - 5)
                    .attr('x2', xScale(d.attr1))
                    .attr('y1', yScale(d.attr2))
                    .attr('y2', yScale(d.attr2))
                    .style('opacity', 0.8)

            })
            .on('mouseout', d => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0)

                axisLine.transition()
                    .duration(500)
                    .style('opacity', 0)

                axisLine2.transition()
                    .duration(500)
                    .style('opacity', 0)
            })

        if (width > 400) {
            var ylabel = d3.select('.scatter')
                .select('svg')
                .append('g')
                .attr('class', 'yaxis_label')
                .append('text')
                .text(`${this.props.attr2}`)
                .attr('x', 20)
                .attr('y', (height + margin) / 2)

            var xlabel = d3.select('.scatter')
                .select('svg')
                .append('g')
                .attr('class', 'xaxis_label')
                .append('text')
                .text(`${this.props.attr1}`)
                .attr('x', (margin + width) / 2)
                .attr('y', height + 40)


            for (let i = 0; i < distinct_attr3.length; i++) {
                let ub = colorGen.invertExtent(distinct_attr3[i])
                d3.select('svg')
                    .append('rect')
                    .attr('x', width + 20)
                    .attr('y', 100 + i * 20)
                    .attr('width', 15)
                    .attr('height', 15)
                    .attr('fill', d3.interpolateViridis(ub[1]))

                d3.select('svg')
                    .append('text')
                    .attr('class', 'legendtext')
                    .attr('x', width + 40)
                    .attr('y', 110 + i * 20)
                    .text(distinct_attr3[i])

            }

            d3.select('svg')
                .append('text')
                .text(`${this.props.attr3}`)
                .attr('x', width + 40)
                .attr('y', 90)
        }


    }
    render() {
        const thumbnail = this.props.w < 400 ? true : false
        return (
            <div className='scatter'>
                <Style scopeSelector='.scatter'
                    rules={{
                        circle: {
                            opacity: 0.7,

                        },
                        '.tooltip': {
                            backgroundColor: 'black',
                            padding: '0.5rem',
                            borderRadius: '2px',
                            color: 'white'
                        },
                        '.axisLine': {
                            'strokeDasharray': 3
                        },
                        '.legendtext': {
                            fontSize: '1.1rem'
                        },
                        '.axis': {
                            fontSize: thumbnail ? '0.5rem' : '1.2rem'
                        }

                    }}

                ></Style>

            </div>
        )
    }
}

export default Scatter