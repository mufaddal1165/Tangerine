import React, { Component } from 'react'
import Chart from '../components/Chart.jsx'
import { Row, Col } from 'react-bootstrap'
import DBarChart from '../components/DivergingBar.jsx'
import BarChart from '../components/Bar_d.jsx'
import Scatter from '../components/Scatter.jsx'
import DecisionTree from '../components/DecisionTree.jsx'
import SideBar from '../components/SideBar.jsx'
import TopBar from '../components/TopBar.jsx'
import Border from '../components/Border.jsx'
import { Style } from 'radium'


class HumanResource extends Component {
    constructor(props) {
        super(props)
    }
    render() {

        return <div>
            <TopBar />
            <div className="sidebar">
                <Style scopeSelector=".sidebar" rules={{
                    position: "absolute",
                    left: "0px"
                }}>

                </Style>
            </div>
            <div className="dashboard">
                <Style scopeSelector=".dashboard" rules={{
                    display:"flex",
                    padding:"20px",
                    backgroundColor:"#eeeeee"
                }}></Style>
                <Border type="Scatter">
                    <Scatter attr1="Age" attr2="YearsAtCompany" attr3="Attrition" w={350} h={350}></Scatter>
                </Border>
                <Border type="Bar">

                <BarChart attr="JobSatisfaction" w={350} h={350}></BarChart>
                </Border>
                <Border type="Diverge">
                    <DBarChart attr1="MaritalStatus" attr2="Attrition" w={350} h={350}></DBarChart>
                </Border>
                <Border type="DecisionTree">
                DecisionTree
                </Border>
            </div>
        </div>


    }
}
export default HumanResource
