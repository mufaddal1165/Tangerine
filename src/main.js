import React from 'react'
import ReactDOM,{render} from 'react-dom'
import HumanResource from './containers/App.jsx'
import { IndexRoute, Router, Route, browserHistory,hashHistory } from 'react-router';
import BarChartDisplay from './components/BarChartDisplay.jsx'
import DivergingBarDisplay from './components/DivergingBarDisplay.jsx'
import ScatterDisplay from './components/ScatterDisplay.jsx'
import DecisionTreeDisplay from './components/DecisionTreeDisplay.jsx'



render(
    <Router history={browserHistory}>
      <Route path="/" component={HumanResource}/>        
        <Route path="Bar" component={BarChartDisplay}/>
        <Route path="Diverge" component={DivergingBarDisplay}/>
        <Route path="Scatter" component={ScatterDisplay}/>
        <Route path="DecisionTree" component={DecisionTreeDisplay}/>
    </Router>,
    document.getElementById('app')
)
