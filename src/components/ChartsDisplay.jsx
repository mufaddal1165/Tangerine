import React, { Component } from 'react'
import { Style } from 'radium'

class ChartsDisplay extends Component {
    constructor(props) {
        super(props)
        var categorical = [
            "Attrition",
            "BusinessTravel",
            "Department",
            "Education",
            "EducationField",
            "EnvironmentSatisfaction",
            "Gender",
            "JobInvolvement",
            "JobLevel",
            "JobRole",
            "JobSatisfaction",
            "MaritalStatus",
            "OverTime",
            "RelationshipSatisfaction",
            "PerformanceRating",
            "WorkLifeBalance",
            "StockOptionLevel",


        ]
        var attributes = [
            "Age",
            "DailyRate",
            "DistanceFromHome",
            "HourlyRate",
            "MonthlyIncome",
            "MonthlyRate",
            "NumCompaniesWorked",
            "PercentSalaryHike",
            "TotalWorkingYears",
            "TrainingTimesLastYear",
            "YearsAtCompany",
            "YearsInCurrentRole",
            "YearsSinceLastPromotion",
            "YearsWithCurrManager"
        ]
        this.state = {
            attributes: attributes,
            categorical: categorical
        }
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }
    componentDidMount() {



    }
    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
       
            this.props.handler(event.target.name, event.target.value)
    }
    render() {
        const scatterPane = (<div className="SelectPane">
                        <select name="attr1" className="attributes" id="attr1" onChange={this.onChangeHandler}>
                            {
                                this.state.attributes.map(attr => {
                                    return <option key={attr} value={attr}>{attr}</option>
                                })
                            }
                        </select>
                        <select name="attr2" id="attr2" className="attributes" onChange={this.onChangeHandler}>
                            {
                                this.state.attributes.map(attr => {
                                    return <option key={attr} value={attr}>{attr}</option>
                                })
                            }
                        </select>
                        <select name="attr3" id="attr3" className="attributes" onChange={this.onChangeHandler}>
                            {
                                this.state.categorical.map(attr => {
                                    return <option key={attr} value={attr}>{attr}</option>
                                })
                            }
                        </select>
                        <button type="submit" onClick={() => {
                            this.props.handler('attr3', this.state.attr3)
                        }}>
                            Go!
                        </button>
                        </div>)
        const barPane = (<div></div>)
        return (
            <div className="chartparent">
                <Style scopeSelector=".chartparent" rules={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "column",
                    minHeight: "100vh",
                    ".ControlPane": {
                        backgroundColor: "#424242",
                        width: "100%",
                        height: "9rem",
                        flexDirection:"row",
                        alignSelf: "flex-end",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"

                    },
                    ".ChartTitle": {
                        margin: "7px 5px 15px 10px",
                        color: "white",
                        fontSize: "30px",

                    },
                    ".DisplayPane": {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    },
                    ".SidePane": {
                        width: "20rem",
                        height: "100%",
                        backgroundColor: "#eeeeee"
                    },
                    ".attributes": {
                        margin: "5px",
                        padding: "10px",
                        border: "none",
                        borderRadius: "10px"
                    },
                    button: {
                        margin: "13px",
                        color: "white",

                        border: "none",
                        backgroundColor: "#E53935",
                        padding: "8px",
                        borderRadius: "15px"
                    }

                }}></Style>

                <div className="DisplayPane">
                    <div className="Chart">
                        {this.props.children}
                    </div>
                    <div className="SidePane">

                    </div>
                </div>
                <div className="ControlPane">
                    
                        <div className="ChartTitle">
                            {this.props.title}
                        </div>
                        {scatterPane}
                </div>
            </div>
        )
    }
}

export default ChartsDisplay