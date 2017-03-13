import React, {PropTypes} from 'react';
import * as d3 from 'd3'
import {Style} from 'radium'
class Bar extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  d3.csv('../../data/hr.csv',d=>{
    var _vars = ['JobSatisfaction','EnvironmentSatisfaction']
    for (var _var of _vars){
    switch(d[_var]){
      case 'Low':
      d[_var] = 1
      break
      case 'Medium':
      d[_var] = 2
      break
      case 'High':
      d[_var] = 3
      break
      case 'Very High':
      d[_var] = 4
      break
    }
}
    return d
  },this.draw.bind(this))
  }
  draw(data){
    var margin = 75
    var height = this.props.h - margin
    var width = this.props.w - margin
    var job_sat = [0,0,0,0,0]
    var env_sat = [0,0,0,0,0]
    var svg_bar = d3.select('.barchart')
    .append('svg')
    .attr('height',height+margin)
    .attr('width',width+margin)
    .attr('g')
    // count categories
    for(var row of data){
    job_sat[row.JobSatisfaction]+=1
    env_sat[row.EnvironmentSatisfaction]+=1
    }
    //bind data
    d3.select('.barchart')
    .select('svg')
    .selectAll('rect')
    .data(job_sat)
    .enter()
    .append('rect')
    // debugger;
    var horzExtent = d3.extent(data,d=>d['JobSatisfaction'])
    console.log(horzExtent)
    var vertScale = d3.scaleLinear().range([height,margin]).domain([0,data.length])
    var horizontalScale = d3.scaleLinear().range([margin,width]).domain([horzExtent[0]-1,horzExtent[1]+1])
    var vertAxis = d3.axisLeft(vertScale).ticks(40)
    var keywords = ['','Low','Medium','High','Very High']
    var horzAxis = d3.axisBottom(horizontalScale).tickFormat(d=>keywords[d])
    d3.select('.barchart')
    .select('svg')
    .append('g')
    .attr('class','y axis')
    .attr('transform',`translate(${margin},0)`)
    .call(vertAxis)

    d3.select('.barchart')
    .select('svg')
    .append('g')
    .attr('class','x axis')
    .attr('transform',`translate(0,${height})`)
    .call(horzAxis)
    let binWidth = 50
    d3.selectAll('rect')
    .attr('y',(e,i)=>vertScale(job_sat[i]))
    .attr('height',(e,i)=>{
      return vertScale(0)- vertScale(job_sat[i])
    })
    .attr('width',binWidth)
    .attr('x',(e,i)=>horizontalScale(i))
    .attr('transform',`translate(${-binWidth/2},0)`)

  }
  render() {
    return (<div className='barchart'>
    <Style
      scopeSelector='.barchart'
      rules={{
        rect:{
          fill:'teal'
        }
      }}
      ></Style>
  </div>);
  }
}

export default Bar
