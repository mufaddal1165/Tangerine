import React,{Component} from 'react'
import Chart from '../components/Chart.jsx'
import {Row,Col} from 'react-bootstrap'
import DBarChart from '../components/DivergingBar.jsx'
import BarChart from '../components/Bar_d.jsx'
import Scatter from '../components/Scatter.jsx'
import DecisionTree from '../components/DecisionTree.jsx'
import SideBar from '../components/SideBar.jsx'
import {Style} from 'radium'


class App extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return <div>
        
       <div className="sidebar">    
        <Style scopeSelector=".sidebar" rules={{
            position:"absolute",
            left:"0px"
        }}>
            
        </Style>
        
        <SideBar/>        
        </div>       
        
        </div>

    }
}
export default App
