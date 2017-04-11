import React from 'react'
import ReactDOM,{render} from 'react-dom'
import HumanResource from './containers/App.jsx'
import { IndexRoute, Router, Route, browserHistory,hashHistory } from 'react-router';
import BarChartDisplay from './components/BarChartDisplay.jsx'
import DivergingBarDisplay from './components/DivergingBarDisplay.jsx'
import ScatterDisplay from './components/ScatterDisplay.jsx'
import DecisionTreeDisplay from './components/DecisionTreeDisplay.jsx'
import WordCloud from './components/viz/WordCloud/index.js'


render(
    <Router history={hashHistory}>
      <Route path="/" component={HumanResource}/>        
        <Route path="Bar" component={BarChartDisplay}/>
        <Route path="Diverge" component={DivergingBarDisplay}/>
        <Route path="Scatter(/:attr1)(/:attr2)(/:attr3)" component={ScatterDisplay}/>
        <Route path="DecisionTree" component={DecisionTreeDisplay}/>
        <Route path="cloud" component={WordCloud}/>
    </Router>,
    document.getElementById('app')
)
