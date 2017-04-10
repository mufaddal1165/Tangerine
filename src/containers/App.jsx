import React,{Component} from 'react'
import Chart from '../components/Chart.jsx'
import {Row,Col} from 'react-bootstrap'
import DBarChart from '../components/DivergingBar.jsx'
import BarChart from '../components/Bar_d.jsx'
import Scatter from '../components/Scatter.jsx'
import DecisionTree from '../components/DecisionTree.jsx'

class App extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return <div>

       
       <Col sm={6}>    
        <Scatter w={600} h={450} attr1='Age' attr2='YearsAtCompany' attr3='RelationshipSatisfaction'/>
        </Col>
        <Col sm={6}>
        <BarChart w={600} h={500}/>
        </Col>
        {/*<DecisionTree></DecisionTree>*/}
        
        </div>

    }
}
export default App
