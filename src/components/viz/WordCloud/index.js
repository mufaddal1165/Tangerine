import React, { Component } from 'react';
import ToolTip from 'react-portal-tooltip';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import classnames from 'classnames';
import isArray from 'isarray';
import axios from 'axios'
import './WordCloud.css';

// import trump from './trump.json';
// const data = trump.map((o) => {
//   o.size = o.count;
//   return o;
// });

class WordCloud extends Component {
  constructor(){
    super();
    this.state = {
      isTooltipActive: false,
      hoveredData: null
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }
  
  showTooltip(d) {
    this.setState({ isTooltipActive: true, hoveredData: d });
  }

  hideTooltip() {
    this.setState({ isTooltipActive: false });
  }

  componentDidMount() {
    const container = this.svgContainer;
    const self = this;
    var fill = d3.scaleOrdinal(d3.schemeCategory20)
    axios.get('./trump.json')
    .then(cloud=>{
      console.log(cloud)
      this.setState({
        data:cloud.data
      })
    })
    var layout = cloud()
        .size([this.props.w, this.props.h])
        .words(this.state.data)
        .padding(5)
        .rotate(function() { return (~~(Math.random() * 5) - 2) * 20; })
        .font("Impact")
        .spiral("rectangular")
        .fontSize(function(d) { return (d.size + 6); })
        .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select(container).append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; })
          .on('mouseenter',  d => {
            self.showTooltip(d)
          })
          .on('mouseleave', d => {
            self.hideTooltip()
          });
    }
  }

  getAssociatedKeywords(d) {
    const words = [];
    if (isArray(d.assoc[0])) {
      for (let a of d.assoc) {
        for (let kw of a) {
          words.push(kw);
        }
      }
    } else {
      for (let kw of d.assoc) {
        words.push(kw);
      }
    }
    console.log(words);
    return words.map((word) => {
      return <p className={word.sentiment.type}>{word.word}</p>
    });
  }

  render() {
    const d = this.state.hoveredData;
    if (d) {
    return (
      <div>
        <div id="svg" ref={ div => this.svgContainer = div }></div>
        <ToolTip active={this.state.isTooltipActive} arrow="center" parent="#svg">
          <div className="tooltip">
            <h4>{d.type}</h4>
            <h5>Sentiment:</h5>
            <p className={d.sentiment.type}>{d.sentiment.type}</p>
            <p className={d.sentiment.type}>Rating: {d.sentiment.score}</p>
            <h6>Associated keywords</h6>
            {this.getAssociatedKeywords(d)}
          </div>
        </ToolTip>
      </div>
    );
  } else {
    return (
      <div>
        <div id="svg" ref={ div => this.svgContainer = div }></div>
      </div>
    );
  }
  }
}

export default WordCloud;
