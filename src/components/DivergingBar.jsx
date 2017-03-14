import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from 'radium'

class DivergingBar extends Component {

    componentDidMount() {
        d3.request(`http://localhost:8000/api/diverging?x=RelationshipSatisfaction&y=Gender`)
            .mimeType('application/json')
            .response(xhr => JSON.parse(xhr.responseText))
            .get(data => this.draw(data))

    }
    draw(data) {
        var margin = 75
        var width = this.props.w - margin
        var height = this.props.h - margin
        var colors = [d3.interpolateInferno(0.7),d3.interpolateInferno(0.4)]

    
        var svg = d3.select('.divergingbars')
            .append('svg')
            .attr('height', height + margin)
            .attr('width', width + margin)

        let parts = ['left', 'right']
        for (let par of parts) {
            d3.select('.divergingbars')
                .select('svg')
                .append('g')
                .attr('class', par)
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')

        }
        var attr1_No = 0
        var attr2_No = 0
        for (let doc of data){
            attr1_No += doc['children'][0]['count']
            attr2_No += doc['children'][1]['count']
        }
        console.log(attr1_No,attr2_No)
        let total = attr1_No + attr2_No
        
        var keywords = []
        for (let v of data) {
            keywords.push(v['_id'])
        }


        var vertScale = d3.scaleLinear()
            .range([height, margin])
            .domain([-1, data.length])

        var vertAxis = d3.axisLeft(vertScale).tickFormat(i=>keywords[i])

        d3.select('.divergingbars')
        .select('svg')
        .append('g')
        .attr('class','x axis')
        .attr('transform',`translate(${margin},0)`)
        .call(vertAxis)

        var horzScale1 = d3.scaleLinear()
            .range([(width + margin) / 2, margin])
            .domain([0, 100])

        var horzAxis1 = d3.axisBottom(horzScale1)
            .ticks(10)


        d3.select('.right')
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(0,${height})`)
            .call(horzAxis1)


        var horzScale2 = d3.scaleLinear()
            .range([(width + margin) / 2, width])
            .domain([0, 100])

        var horzAxis2 = d3.axisBottom(horzScale2)
            .ticks(10)

        d3.select('.left')
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(0,${height})`)
            .call(horzAxis2)


        let bindwidth = this.props.w/10
        //    debugger;
        d3.select('.left')
            .selectAll('rect')
            .attr('y', (e, i) => vertScale(i))
            .attr('x', (width + margin) / 2)
            .attr('height', bindwidth)
            .attr('fill', colors[0])
            .attr('width',0)
            .transition()
            .duration(1000)
            .attr('width', (e, i) => horzScale2(data[i]['children'][0]['count']/attr1_No*100) - horzScale2(0))
            
        // debugger;
        d3.select('.right')
            .selectAll('rect')
            .attr('y', (e, i) => vertScale(i))
            .attr('x',(width+margin)/2)
            .attr('height', bindwidth)
            .attr('fill', colors[1])
            .attr('width',0)
            .transition()
            .duration(1000)
            .attr('x', (e, i) => horzScale1(data[i]['children'][1]['count']/attr2_No*100))
            .attr('width', (e, i) => horzScale1(0) - horzScale1(data[i]['children'][1]['count']/attr2_No*100))

        d3.selectAll('rect')
        .attr('class','bars')
        .attr('transform',`translate(0,${-bindwidth/2})`)
        
      
    d3.select('.divergingbars')
    .select('svg')
    .append('g')
    .attr('class','legend')      
       
    
    for (let i=0;i<2;i++)   
    {
        d3.select('.legend')
        .append('g')
        .append('rect')
        .attr('x',655)
        .attr('y',85+i*30)
        .attr('width',15)
        .attr('height',15)
        .attr('fill',colors[i])

        d3.select('.legend')
        .append('g')
        .append('text')
        .attr('x',680)
        .attr('y',97+i*30)
        .text(data[0]['children'][i]['attr'])
    }
    }
    render() {
        return (
            <div className="divergingbars">

            </div>
        )
    }
}

export default DivergingBar