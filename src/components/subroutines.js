import * as d3 from 'd3'
export var intializeChart = (className) => {
    var margin = 100
    var width = this.props.w - margin
    var height = this.props.h - margin


    var svg = d3.select(`.${className}`)
        .append('svg')
        .attr('height', height + margin)
        .attr('width', width + margin)

}

export var tooltipGen = (className)=> d3.select(`.${className}`)
            .append('text')
            .attr('class', 'tooltip')
            .attr('opacity', 0)
 
export var axisLineGen =(className)=> d3.select(`.${className}`).select('svg').append('line')
            .attr('class', 'axisLine')
            .style('stroke', 'rgb(0,0,0)')
            .style('stroke-width', 1)
            .style('opacity', 0)  