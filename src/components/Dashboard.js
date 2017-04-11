import React, { Component } from 'react';
import BrandPerception from './viz/BrandPerception';
import WordCloud from './viz/WordCloud';
import cc from './cc';
import Sidebar from './Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ccData = cc.map((ar) => {
  return { name: `${ar[0]}/12/2016`, confidence: ar[1] };
})

const bpDataSet = {
  unilever: [
    ['Eco-Friendliness', 0.78],
    ['Luxury', 0.12],
    ['Affordability', 0.89]
  ],
  toyota: [
    ['Eco-Friendliness', 0.48],
    ['Luxury', 0.3],
    ['Affordability', 0.76]
  ],
  apple: [
    ['Eco-Friendliness', 0.18],
    ['Luxury', 0.8],
    ['Affordability', 0.76]
  ]
}

import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: false
    };
  }

  render() {
    const selectedBP = bpDataSet[this.props.params.queryString.toLowerCase()];
    console.log(selectedBP)
    if (!this.isLoading) {
      if (this.props.params.queryString.indexOf('wordcloud:') == -1) {
        return (
          <div className="dashboard">
            <div className="sidebar">
              <Sidebar />
            </div>

            <div className="panel-container">
              <article className="panel">
                <BrandPerception
                  padding="40"
                  h="300"
                  w="350"
                  data={selectedBP} />
              </article>

              <article className="panel area-chart">
                <AreaChart width={600} height={300} data={ccData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                  <Tooltip />
                  <Area type='monotone' dataKey='confidence' stroke='#8884d8' fill='rgb(75, 75, 179)' />
                </AreaChart>
              </article>

              <article className="panel">
                <WordCloud w={500} h={300} />
              </article>

            </div>


          </div>
        );
      }
      else {
        return (
          <div className="dashboard">
            <div className="sidebar">
              <Sidebar />
            </div>
            <article className="panel">
              <WordCloud w={500} h={300} />
            </article>

          </div>
        </div>
        );
      }
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default Dashboard;
