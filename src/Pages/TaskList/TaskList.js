import React from "react";
import { Jumbotron, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import API from "../../utils/API";
import moment from "moment";
import "./TaskList.scss";
import { isNullOrUndefined } from "util";

class TaskList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            employee_data: [],
            tasks: [],
            quoteApproved: false,
            employee: "",
            tooltipOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentWillMount = () => {
        API.getEmployees()
        .then(res => {
            this.setState({
                employee_data: res.data 
            });
        })
        .catch(err => console.log(err));

    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleInputChange = e => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    }

    getTasks = () => {
        if(this.state.employee.length > 0){
            API.getEmployeeTasks(this.state.employee.split(" ").join("%20"))
            .then(res => {
                console.log(res.data);
                this.setState({
                    tasks: res.data
                });
            })
            .catch(err => console.log(err));

            
        }
    }

    render(){
        return (
            <div> 
            <Container>
            <Jumbotron>
            <FormGroup>
                <Label for="employee">Employee Name</Label>
                <Input type="select" name="employee" id="employee" onChange={this.handleInputChange} onClick={this.getTasks}>
                    <option>Choose your name</option>
                    {this.state.employee_data.map(x => <option value={x.EMP_NAME}>{x.EMP_NAME}</option>)}
                </Input>
            </FormGroup>
            </Jumbotron>
           
            </Container>
           <Container>
           <Button>Sort by Service</Button>
            <h5 style = {{'fontFamily': 'Noto Serif SC, serif'}}>Active Tasks</h5>
            <br/>
            <table id="active" style={{'text-align':'center'}}>
            <thead className="table-header">
                <tr>
                    <th className="col">QUOTATION NUMBER</th>
                    <th className="col">SERVICE</th>
                    <th className="col">CLIENT</th>
                    <th className="col">DATE ASSIGNED</th>
                    <th className="col">DUE TIME</th>
                    <th className="col">SERVICE UNITS</th>
                    <th className="col">DATE COMPLETED (YYYY-MM-DD)</th>
                    <th className="col">STATUS/NOTES/COMMENTS</th>
                    <th className="col">SERVICE DESCRIPTION</th>
                    <th className="col">QUOTE APPROVED</th>
                    <th className="col">COMPLETED</th>
                </tr>
            </thead>
            <tbody>
                {this.state.tasks.filter(x => isNullOrUndefined(x.dateCompleted) && x.quotationIssuedBy === this.state.employee).map((x, index) => 
                <tr key={"activeList"+index} className="table-row">
                    <td key={"activeList"+index+"quotationNumber"}>{x.quotationNumber}</td>
                    <td key={"activeList"+index+"service"}>{x.service}</td>
                    <td key={"activeList"+index+"client"}>{x.client}</td>
                    <td key={"activeList"+index+"dateAssigned"}>{moment(x.dateAssigned).format("YYYY-MM-DD")}</td>
                    <td key={"activeList"+index+"dueTime"}>{moment(x.dueDate).format("YYYY-MM-DD")}</td>
                    <td key={"activeList"+index+"serviceUnits"}>{x.qty}</td>
                    <td key={"activeList"+index+"_dateOfCompletion"}>
                    <Input
                          type="text"
                          name={"dateOfCompletion"}
                          id="dateOfCompletion"
                          value={moment(x.createdAt).format("YYYY-MM-DD")}
                          placeholder="Enter date of completion"
                          onChange={this.handleInputChange}
                        />
                    </td>
                    <td key={"activeList"+index+"_notes_comments"}>
                    <Input
                          type="textarea"
                          name="comments"
                          id="comments"
                          value={x.status_notes_comments}
                          placeholder="Enter status/notes/comments"
                          onChange={this.handleInputChange}
                        />
                    </td>
                    <td key={"activeList" + index + "serviceDescription"}>
                     {x.serviceDescription}

                    </td>
                    <td key={"activeList"+index+"_quoteApproved"}>
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={true}/>{' '}
                            Yes
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={false}/>{' '}
                            No
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    </td>
                    <td key={"activeList"+index+"_completed"}>
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="completed" value={true}/>{' '}
                            Yes
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="completed" value={false}/>{' '}
                            No
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
            <br/><br/>
            <h5 style = {{'fontFamily': 'Noto Serif SC, serif'}}>Completed Tasks</h5>
            <br/>
            <table id="active" style={{'text-align':'center'}}>
            <thead className="table-header">
                <tr>
                    <th className="col">QUOTATION NUMBER</th>
                    <th className="col">SERVICE</th>
                    <th className="col">CLIENT</th>
                    <th className="col">DATE ASSIGNED</th>
                    <th className="col">DUE TIME</th>
                    <th className="col">SERVICE UNITS</th>
                    <th className="col">DATE COMPLETED (YYYY-MM-DD)</th>
                    <th className="col">STATUS/NOTES/COMMENTS</th>
                    <th className="col">SERVICE DESCRIPTION</th>
                    <th className="col">QUOTE APPROVED</th>
                    <th className="col">COMPLETED</th>
                </tr>
            </thead>
            <tbody>
                {this.state.tasks.filter(x => !isNullOrUndefined(x.dateCompleted) && x.quotationIssuedBy === this.state.employee).map((x, index) => 
                <tr key={"activeList"+index} className="table-row">
                    <td key={"activeList"+index+"quotationNumber"}>{x.quotationNumber}</td>
                    <td key={"activeList"+index+"service"}>{x.service}</td>
                    <td key={"activeList"+index+"client"}>{x.client}</td>
                    <td key={"activeList"+index+"dateAssigned"}>{moment(x.dateAssigned).format("YYYY-MM-DD")}</td>
                    <td key={"activeList"+index+"dueTime"}>{moment(x.dueDate).format("YYYY-MM-DD")}</td>
                    <td key={"activeList"+index+"serviceUnits"}>{x.qty}</td>
                    <td key={"activeList"+index+"_dateOfCompletion"}>
                    <Input
                          type="text"
                          name={"dateOfCompletion"}
                          id="dateOfCompletion"
                          value={moment(x.createdAt).format("YYYY-MM-DD")}
                          placeholder="Enter date of completion"
                          onChange={this.handleInputChange}
                        />
                    </td>
                    <td key={"activeList"+index+"_notes_comments"}>
                    <Input
                          type="textarea"
                          name="comments"
                          id="comments"
                          value={x.status_notes_comments}
                          placeholder="Enter status/notes/comments"
                          onChange={this.handleInputChange}
                        />
                    </td>
                    <td key={"activeList" + index + "serviceDescription"}>
                    {x.serviceDescription}
                    </td>
                    <td key={"activeList"+index+"_quoteApproved"}>
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={true}/>{' '}
                            Yes
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={false} />{' '}
                            No
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    </td>
                    <td key={"activeList"+index+"_completed"}>
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={true}/>{' '}
                            Yes
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="quoteApproved" value={false} />{' '}
                            No
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
           </Container>
            </div>
        )
    }
}

export default TaskList;