import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from 'radium'
import SERVER_URL from '../constants/constants.js'
import axios from 'axios'
// import d3tip from 'd3-tip'
class BarChart extends Component {
    constructor(props) {

        super(props)

    }

    componentDidMount() {

    this.state = {
        isToolTip : false
    }
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

        var tooltip = d3.select('.barchart').append('text')
        .attr('class','tooltip')
        .style('opacity',0)
        var axisLine = d3.select('.barchart').select('svg').append('line')
        .attr('class','axisLine')
        .style('stroke','rgb(0,0,0)')
        .style('stroke-width',1)
        .style('opacity',0)

        // debugger;
        d3.selectAll('rect')
        .on('mouseover',(d,i)=>{
            let count = d['count']
            tooltip.transition()
            .duration(1000)
            .style('opacity',0.9)
            tooltip.text(`${d['_id']}: ${d['count']}`)
            .style('left',(d)=>horzScale(i)+'px')
            .style('top',(d)=>(vertScale(count)-15)+'px')

            axisLine.transition()
            .duration(500)
            .attr('x1',margin-10)
            .attr('x2',margin-10)
            .attr('y1',vertScale(d['count']))
            .attr('y2',vertScale(d['count']))
            .style('opacity',0.8)
            .transition()
            .duration(200)
            .attr('x2',horzScale(i))
            

        })
        .on('mouseout',
            d=>{
                tooltip.transition()
                .duration(1000)
                .style('opacity',0)

                axisLine.transition()
                .duration(1000)
                .style('opacity',0)
            }
        )
            





    }
    
    
    render() {
        return (<div className='barchart'>
            <Style
                scopeSelector='.barchart'
                rules={{
                    rect: {
                        fill: '#FFC400'
                    },
                    '.bars:hover': {
                        fill: 'yellow'
                    },
                    '.tooltip':{
                        backgroundColor:'black',
                        padding:'0.5rem',
                        borderRadius:'2px',
                        color:'white'
                    },
                    '.axisLine':{
                        'strokeDasharray':3
                    },
                    '.x':{
                        fontSize:'1.5rem'
                    }

                }}
            ></Style>
        </div>)
    }
}

export default BarChart