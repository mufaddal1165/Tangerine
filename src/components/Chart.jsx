import React, {Component} from 'react'
import  * as d3 from 'd3'
// import dimple,{scale} from 'dimple-js/dist/dimple.v2.1.4.min.js'
import {Style} from 'radium'

class Chart extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    d3.csv('../../data/hr.csv',d=>{
    d['MonthlyIncome'] = +d['MonthlyIncome']
    switch(d['JobSatisfaction']){
      case 'Low':
      d['JobSatisfaction'] = 1
      break
      case 'Medium':
      d['JobSatisfaction'] = 2
      break
      case 'High':
      d['JobSatisfaction'] = 3
      break
      case 'Very High':
      d['JobSatisfaction'] = 4
      break
    }
    return d
  },this.draw.bind(this))

  }
  draw(data){
    var margin = 50
    var width = this.props.w - margin
    var height = this.props.h - margin
    var svg = d3.select('.chart')
    .append('svg')
    .attr('width',width+margin)
    .attr('height',height+margin)
    .attr('g')

    d3.select('svg')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')

    var jobSatExtent = d3.extent(data,d=>d['JobSatisfaction'])
    var monIncExtent = d3.extent(data,d=>d['MonthlyIncome'])
    var incScale = d3.scaleLinear().range([margin,width]).domain(monIncExtent)
    var satScale = d3.scaleLinear().range([height,margin]).domain([0,jobSatExtent[1]])
    var incAxis = d3.axisBottom(incScale)
    var satAxis = d3.axisLeft(satScale).tickValues([1,2,3,4])
    d3.select('svg')
    .append('g')
    .attr('class','x axis')
    .attr('transform',`translate(0,${height})`)
    .call(incAxis)

    d3.select('svg')
    .append('g')
    .attr('class','y axis')
    .attr('transform',`translate(${margin},0)`)
    .call(satAxis)


    d3.selectAll('circle')
    .attr('cx',d=>incScale(d['MonthlyIncome']))
    .attr('cy',d=>satScale(d['JobSatisfaction']))
    .attr('r',d=>Math.log10(d['MonthlyIncome']))
    .attr('fill','crimson')

  }
  render () {
    return (
      <div className = 'chart' ref='chart' >
        <Style scopeSelector=".chart" rules={{
            circle:{
              opacity:0.3
            }
          }}>
        </Style>
      </div>
    )
  }
}

export default Chart
