import React, {Component} from 'react';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Alert
} from 'reactstrap';
import axios from 'axios';

class App extends Component {
  state = {
    employees: {},
    newEmployeeModal: false,
    newEmployeeData: {
      firstName: '',
      lastName: '',
      hireDate: '',
      role: ''
    },
    editEmployeeModal: false,
    editEmployeeData: {
      firstName: '',
      lastName: '',
      hireDate: '',
      role: '',
      firstQuote: '',
      secondQuote: ''
    },
    errorFromAPI: ''
  }

  componentWillMount() {
    this._refreshEmployees();
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true});
  }

  toggleNewEmployeeModal() {
    this.setState({
      newEmployeeModal: !this.state.newEmployeeModal
    })
  }

  resetError() {
    this.setState({errorFromAPI: ''});
  }

  toggleEditEmployeeModal() {
    this.setState({
      editEmployeeModal: !this.state.editEmployeeModal
    })
  }

  _refreshEmployees() {
    axios.get('http://localhost:3000/employees').then((response) => {
      this.setState({
        employees: response.data
      })
    });
  }

  addEmployee() {
    axios.post('http://localhost:3000/employees', this.state.newEmployeeData)
    .then((response) => {
      console.log(response.data);
      let {data} = response;

      let {employees} = this.state;

      let id = data.id;

      employees[id] = data;

      this.setState({
        employees, newEmployeeModal: false, newEmployeeData: {
          firstName: '',
          lastName: '',
          hireDate: '',
          role: ''
        }

      });
    }).catch(error => {
      this.setState({errorFromAPI: error.response.data});
    });
  }

  editEmployee(id, firstName, lastName, hireDate, role, firstQuote,
      secondQuote) {
    //console.log(id);
    this.setState({
      editEmployeeData: {
        id, firstName, lastName, hireDate, role, firstQuote,
        secondQuote
      },
      editEmployeeModal: !this.state.editEmployeeModal
    });
  }

  updateEmployee() {
    //this.state.editEmployeeModal
    let {firstName, lastName, hireDate, role, firstQuote, secondQuote} = this.state.editEmployeeData;
    axios.put(
        'http://localhost:3000/employees/' + this.state.editEmployeeData.id, {
          firstName, lastName, hireDate, role, firstQuote, secondQuote
        }).then((response) => {
      //console.log(response.data);
      this._refreshEmployees();
      this.setState({
        editEmployeeModal: false, editEmployeeData: {
          firstName: '',
          lastName: '',
          hireDate: '',
          role: '',
          firstQuote: '',
          secondQuote: ''
        }
      })
    }).catch(error => {
      this.setState({errorFromAPI: error.response.data});
    });
  }

  deleteEmployee(id) {
    axios.delete('http://localhost:3000/employees/' + id).then((response) => {
      this._refreshEmployees();
    }).catch(error => {
      console.log(error.response);
    });
    ;
  }

  render() {
    let employees = Object.keys(this.state.employees).map((id, i) => {
      return (
          <tr key={i}>
            <td>{this.state.employees[id].id}</td>
            <td>{this.state.employees[id].firstName}</td>
            <td>{this.state.employees[id].lastName}</td>
            <td>{this.state.employees[id].hireDate}</td>
            <td>{this.state.employees[id].role}</td>
            <td>{this.state.employees[id].firstQuote}</td>
            <td>{this.state.employees[id].secondQuote}</td>
            <td>
              <Button color="success" size="sm" className="mr-2"
                      onClick={this.editEmployee.bind(this,
                          this.state.employees[id].id,
                          this.state.employees[id].firstName,
                          this.state.employees[id].lastName,
                          this.state.employees[id].hireDate,
                          this.state.employees[id].role,
                          this.state.employees[id].firstQuote,
                          this.state.employees[id].secondQuote)}>Edit</Button>
              <Button color="danger" size="sm"
                      onClick={this.deleteEmployee.bind(this,
                          this.state.employees[id].id)}>Delete</Button>
            </td>
          </tr>
      )
    });
    return (
        <div className="App container">
          <h1> Employees </h1>


          <Button className="my-3" color="primary"
                  onClick={this.toggleNewEmployeeModal.bind(this)}>Add
            Employee</Button>

          <Modal isOpen={this.state.newEmployeeModal}
                 toggle={this.toggleNewEmployeeModal.bind(this)}
                 onClosed={this.resetError.bind(this)}>
            <ModalHeader toggle={this.toggleNewEmployeeModal.bind(this)}>Add New
              Employee</ModalHeader>
            {
              this.state.errorFromAPI ? <Alert color="danger">
                {this.state.errorFromAPI}
              </Alert> : ''
            }
            <ModalBody>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input id="firstName"
                       value={this.state.newEmployeeData.firstName}
                       onChange={(e) => {
                         let {newEmployeeData} = this.state;
                         newEmployeeData.firstName = e.target.value;
                         this.setState({newEmployeeData});
                       }}/>
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input id="lastName" value={this.state.newEmployeeData.lastName}
                       onChange={(e) => {
                         let {newEmployeeData} = this.state;
                         newEmployeeData.lastName = e.target.value;
                         this.setState({newEmployeeData});
                       }}/>
              </FormGroup>
              <FormGroup>
                <Label for="hireDate">Date</Label>
                <Input
                    type="date"
                    id="hireDate"
                    value={this.state.newEmployeeData.hireDate}
                    onChange={(e) => {
                      let {newEmployeeData} = this.state;
                      newEmployeeData.hireDate = e.target.value;
                      this.setState({newEmployeeData});
                    }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="role">Select Role</Label>
                <Input type="select" placeholder="Choose Role" name="select"
                       id="role"
                       value={this.state.newEmployeeData.role}
                       onChange={(e) => {
                         let {newEmployeeData} = this.state;
                         newEmployeeData.role = e.target.value;
                         this.setState({newEmployeeData});
                       }}>
                  <option> Select a Role</option>
                  <option>MANAGER</option>
                  <option>LACKEY</option>
                  <option>CEO</option>
                  <option>VP</option>
                </Input>
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary"
                      onClick={this.addEmployee.bind(this)}>Add
                Employee</Button>{' '}
              <Button color="secondary"
                      onClick={this.toggleNewEmployeeModal.bind(
                          this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.editEmployeeModal}
                 toggle={this.toggleEditEmployeeModal.bind(this)}
                 onClosed={this.resetError.bind(this)}>
            <ModalHeader toggle={this.toggleEditEmployeeModal.bind(this)}>Edit
              Employee</ModalHeader>
            {
              this.state.errorFromAPI ? <Alert color="danger">
                {this.state.errorFromAPI}
              </Alert> : ''
            }
            <ModalBody>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input id="firstName"
                       value={this.state.editEmployeeData.firstName}
                       onChange={(e) => {
                         let {editEmployeeData} = this.state;
                         editEmployeeData.firstName = e.target.value;
                         this.setState({editEmployeeData});
                       }}/>
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input id="lastName"
                       value={this.state.editEmployeeData.lastName}
                       onChange={(e) => {
                         let {editEmployeeData} = this.state;
                         editEmployeeData.lastName = e.target.value;
                         this.setState({editEmployeeData});
                       }}/>
              </FormGroup>
              <FormGroup>
                <Label for="hireDate">Date</Label>
                <Input
                    type="date"
                    id="hireDate"
                    value={this.state.editEmployeeData.hireDate}
                    onChange={(e) => {
                      let {editEmployeeData} = this.state;
                      editEmployeeData.hireDate = e.target.value;
                      this.setState({editEmployeeData});
                    }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="role">Select Role</Label>
                <Input type="select" name="select" id="role"
                       value={this.state.editEmployeeData.role}
                       onChange={(e) => {
                         let {editEmployeeData} = this.state;
                         editEmployeeData.role = e.target.value;
                         this.setState({editEmployeeData});
                       }}>
                  <option> Select a Role</option>
                  <option>MANAGER</option>
                  <option>LACKEY</option>
                  <option>CEO</option>
                  <option>VP</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="firstQuote">Favorite Joke</Label>
                <Input id="firstQuote"
                       value={this.state.editEmployeeData.firstQuote}
                       onChange={(e) => {
                         let {editEmployeeData} = this.state;
                         editEmployeeData.firstQuote = e.target.value;
                         this.setState({editEmployeeData});
                       }}/>
              </FormGroup>
              <FormGroup>
                <Label for="secondQuote">Favorite Quote</Label>
                <Input id="secondQuote"
                       value={this.state.editEmployeeData.secondQuote}
                       onChange={(e) => {
                         let {editEmployeeData} = this.state;
                         editEmployeeData.secondQuote = e.target.value;
                         this.setState({editEmployeeData});
                       }}/>
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary"
                      onClick={this.updateEmployee.bind(this)}>Update
                Employee</Button>{' '}
              <Button color="secondary"
                      onClick={this.toggleEditEmployeeModal.bind(
                          this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Table>
            <thead>
            <tr>
              <th>#Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Hire Date</th>
              <th>Role</th>
              <th>Favorite Quote</th>
              <th>Second Quote</th>
              <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {employees}
            </tbody>
          </Table>

        </div>
    );
  }
}

export default App;
