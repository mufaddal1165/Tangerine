import React,{Component} from 'react'
import Chart from '../components/Chart.jsx'
import BarChart from '../components/Bar_d.jsx'
class App extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return <div>


        <BarChart w={1400} h={600}/>
        </div>

    }
}
export default App
