import React,{Component} from 'react'
import Chart from '../components/Chart.jsx'
import {Row,Col} from 'react-bootstrap'
import DBarChart from '../components/DivergingBar.jsx'
import BarChart from '../components/Bar_d.jsx'
class App extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return <div>

       
       
        <BarChart w={1000} h={700}/>
      
        
        </div>

    }
}
export default App
