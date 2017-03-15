import React, { Component } from 'react'
import * as d3 from 'd3'
import { Style } from 'radium'

class DivergingBar extends Component {

    componentDidMount() {
        d3.request(`http://localhost:8000/api/diverging?x=MaritalStatus&y=Attrition`)
            .mimeType('application/json')
            .response(xhr => JSON.parse(xhr.responseText))
            .get(data => this.draw(data))

    }
    draw(data) {
        var margin = 100
        var width = this.props.w - margin
        var height = this.props.h - margin
        var colors = [d3.interpolateInferno(0.7), d3.interpolateInferno(0.4)]
        var bindwidth = 300/data.length < 40 ? 300/data.length : 40


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
       
        var total_per_category = []
        for (let doc of data) {
            total_per_category.push( doc['children'][0]['count']+
            doc['children'][1]['count'])
        }
       
        // for changing the chart to use over all total
        // var attr1_No = 0
        // var attr2_No = 0
        // for (let doc of data){
        //     attr1_No += doc['children'][0]['count']
        //     attr2_No += doc['children'][1]['count']
        // }
        //let total = attr1_No + attr2_No

        var keywords = []
        for (let v of data) {
            keywords.push(v['_id'])
        }


        var vertScale = d3.scaleLinear()
            .range([height, margin])
            .domain([-1, data.length])

        var vertAxis = d3.axisLeft(vertScale).tickFormat(i => keywords[i])

        d3.select('.divergingbars')
            .select('svg')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(${margin-5},0)`)
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

        var tooltip = d3.select('.divergingbars')
            .append('text')
            .attr('class', 'tooltip')
            .attr('opacity', 0)

        var axisLine = d3.select('.divergingbars').select('svg').append('line')
            .attr('class', 'axisLine')
            .style('stroke', 'rgb(0,0,0)')
            .style('stroke-width', 1)
            .style('opacity', 0)

        //    debugger;
        d3.select('.left')
            .selectAll('rect')
            .attr('y', (e, i) => vertScale(i))
            .attr('x', (width + margin) / 2)
            .attr('height', bindwidth)
            .attr('fill', colors[0])
            .attr('width', 0)
            .transition()
            .duration(1000)
            .attr('width', (e, i) => horzScale2(data[i]['children'][0]['count'] / total_per_category[i] * 100) - horzScale2(0))

        // debugger;
        d3.select('.right')
            .selectAll('rect')
            .attr('y', (e, i) => vertScale(i))
            .attr('x', (width + margin) / 2)
            .attr('height', bindwidth)
            .attr('fill', colors[1])
            .attr('width', 0)
            .transition()
            .duration(1000)
            .attr('x', (e, i) => horzScale1(data[i]['children'][1]['count'] / total_per_category[i] * 100))
            .attr('width', (e, i) => horzScale1(0) - horzScale1(data[i]['children'][1]['count'] / total_per_category[i] * 100))


        d3.selectAll('rect')
            .attr('class', 'bars')
            .attr('transform', `translate(0,${-bindwidth / 2})`)

        //tooltip code for left
        d3.select('.left')
            .selectAll('rect')
            .on('mouseover', (d, i) => {
                console.log('appear')
                var child = d['children'][0]
                var left = horzScale2(child['count'] / total_per_category[i] * 100) - horzScale2(0) + (margin + width) / 2 
                tooltip.transition()
                    .duration(1000)
                    .style('opacity', 0.7)

                tooltip.text(`${child['attr']}: ${child['count']}, ${Math.round(child['count'] / total_per_category[i] * 100*100)/100} %`)
                    .style('left', (left+5) + 'px')
                    .style('top', vertScale(i) + 'px')

                axisLine.transition()
                    .duration(500)
                    .attr('x1', left)
                    .attr('x2', left)
                    .attr('y1', vertScale(i))
                    .attr('y2', vertScale(i))
                    .style('opacity', 0.8)
                    .transition()
                    .duration(200)
                    .attr('y2',height)
                    
            })
            .on('mouseout', d => {
                tooltip.transition()
                    .duration(1000)
                    .style('opacity', 0)

                axisLine.transition()
                .duration(500)
                .style('opacity',0)
            })

        //tooltip code for right
        d3.select('.right')
            .selectAll('rect')
            .on('mouseover', (d, i) => {
                console.log('appear')
                var child = d['children'][1]
                var left = horzScale1(child['count'] / total_per_category[i] * 100)
                tooltip.transition()
                    .duration(1000)
                    .style('opacity', 0.7)

                tooltip.text(`${child['attr']}: ${child['count']} \n, ${Math.round(child['count'] / total_per_category[i] * 100*100)/100} %`)
                    .style('left', (left-width/9) + 'px')
                    .style('top', vertScale(i) + 'px')

                axisLine.transition()
                    .duration(500)
                    .attr('x1', left)
                    .attr('x2', left)
                    .attr('y1', vertScale(i))
                    .attr('y2', vertScale(i))
                    .style('opacity', 0.8)
                    .transition()
                    .duration(200)
                    .attr('y2',height)
                
            })
            .on('mouseout', d => {
                tooltip.transition()
                    .duration(1000)
                    .style('opacity', 0)

                axisLine.transition()
                .duration(500)
                .style('opacity',0)
            })


        d3.select('.divergingbars')
            .select('svg')
            .append('g')
            .attr('class', 'legend')


        for (let i = 0; i < 2; i++) {
            d3.select('.legend')
                .append('g')
                .append('rect')
                .attr('x', 655)
                .attr('y', 85 + i * 30)
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', colors[i])

            d3.select('.legend')
                .append('g')
                .append('text')
                .attr('x', 680)
                .attr('y', 97 + i * 30)
                .text(data[0]['children'][i]['attr'])
        }
    }
    render() {
        return (
            <div className="divergingbars">
                <Style scopeSelector='.divergingbars' rules={{
                    '.axis': {
                        fontSize: '1.2rem'
                    },
                    '.tooltip': {
                        backgroundColor: 'black',
                        padding: '0.5rem',
                        borderRadius: '2px',
                        color: 'white'
                    },
                    '.axisLine': {
                        'strokeDasharray': 3
                    }
                }}
                >


                </Style>
            </div>
        )
    }
}

export default DivergingBar