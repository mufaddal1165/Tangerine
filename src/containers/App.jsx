import React,{Component} from 'react'
import Chart from '../components/Chart.jsx'
import {Row,Col} from 'react-bootstrap'
import DBarChart from '../components/DivergingBar.jsx'
import BarChart from '../components/Bar_d.jsx'
import Scatter from '../components/Scatter.jsx'
class App extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return <div>

       
       
        <Scatter w={900} h={600} attr1='Age' attr2='YearsAtCompany' attr3='Attrition'/>
      
        
        </div>

    }
}
export default App
