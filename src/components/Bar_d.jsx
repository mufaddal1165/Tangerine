import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from 'radium'
import SERVER_URL from '../constants/constants.js'
import axios from 'axios'
import d3tip from 'd3-tip'
class BarChart extends Component {
    constructor(props) {

        super(props)

    }

    componentDidMount() {


        d3.request(`http://localhost:8000/api/employees?q=RelationshipSatisfaction`)
            .mimeType('application/json')
            .response(xhr => JSON.parse(xhr.responseText))
            .get(data => this.draw(data))

    }
    draw(data) {
        var margin = 75;
        var height = this.props.h - margin
        var width = this.props.w - margin
        var binwidth = this.props.w / 10

        var svg_bar = d3.select('.barchart')
            .append('svg')
            .attr('height', height + margin)
            .attr('width', width + margin)
            .attr('g')
        //bind data
        d3.select('.barchart')
            .select('svg')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')

        let total = 0
        for (let v of data) {
            total += v['count']
        }

        var keywords = []
        for (let v of data) {
            keywords.push(v['_id'])
        }

        // scales
        var vertScale = d3.scaleLinear().range([height, margin]).domain([0, total])

        var horzScale = d3.scaleLinear().range([margin, width]).domain([-1, data.length])

        // axes
        var vertAxis = d3.axisLeft(vertScale).ticks(14)

        var horzAxis = d3.axisBottom(horzScale).tickFormat(i => keywords[i])

        //add vertical axis to chart
        d3.select('.barchart')
            .select('svg')
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${margin - 10},0)`)
            .call(vertAxis)



        // add horizontal axis to chart
        d3.select('.barchart')
            .select('svg')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(horzAxis)

        // assign height and width to bars along with transitions
        d3.selectAll('rect')
            .attr('class', 'bars')
            .attr('y', height)
            .attr('width', binwidth)
            .attr('x', (e, i) => horzScale(i))
            .attr('transform', `translate(${-binwidth / 2},0)`)
            .attr('height', 0)
            .transition()
            .delay((d, i) => i * 200)
            .duration(1000)
            .attr('y', (e, i) => vertScale(data[i]['count']))
            .attr('height', (e, i) => {
                return vertScale(0) - vertScale(data[i]['count'])
            })


    }
    render() {
        return (<div className='barchart'>
            <Style
                scopeSelector='.barchart'
                rules={{
                    rect: {
                        fill: 'crimson'
                    },
                    '.bars:hover': {
                        fill: 'yellow'
                    }
                }}
            ></Style>
        </div>)
    }
}

export default BarChart