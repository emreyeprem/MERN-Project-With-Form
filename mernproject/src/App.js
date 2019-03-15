import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Title from '@material-ui/icons/Title';
import Description from '@material-ui/icons/Description';
import ReactDOM from 'react-dom'
import Pagination from "react-js-pagination";
import ReactPaginate from 'react-paginate';
import axios from 'axios'
import './App.css'

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  margin: {
    marginTop: "15px"
  }
});
var title = ""
var description = ""
function getSteps() {
  return ['Title', 'Description', 'Submit'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <TextField
        onChange = {(event)=>{
          title = event.target.value
          console.log(title)}}
        id="input-with-icon-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Title/>
            </InputAdornment>
          ),
        }}
      />;
    case 1:
      return <TextField
      onChange = {(event)=>{
        description = event.target.value
        console.log(description)}}
        id="input-with-icon-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">

              <Description/>
            </InputAdornment>
          ),
        }}
      />;
    case 2:
      return ``;
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends Component {
  constructor(props){
    super(props)
    this.state={
      title:'',
      description:'',
      activeStep: 0,
      activePage: 1,
      itemsPerPage : 5,
      list:[]
    }
  }
  componentDidMount = ()=>{
    axios.get('http://localhost:3003/getList').then((response)=>{
      console.log(response.data)
      this.setState({
        ...this.state,
        list: response.data
      })
    }).catch((error)=>{
      console.log(error)
    })
  }

  handlePageChange=(pageNumber) =>{
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }
  handleNext = () => {
    this.setState(state => ({
      ...this.state,
      activeStep: state.activeStep + 1,
    })
  )
  };
sendListItem = ()=>{
  this.setState(state => ({
    ...this.state,
    activeStep: state.activeStep + 1,
    title: title,
    description: description,
  }),()=>{
    axios.post('http://localhost:3003/sendListItem',{
      title: this.state.title,
      description: this.state.description
    }).then((response)=>{
      console.log(response.data)
      this.setState({
      list: [...this.state.list, response.data.newAddedItem]  // adding new item to existing list
      })
    }).catch((error)=>{
      console.log(error)
    })
  });
}
deleteItem = (id)=>{
  axios.get(`http://localhost:3003/delete/${id}`).then((response)=>{
    console.log(response.data)
    if(response.data.success == true){
      let updatedList = this.state.list.filter((item)=>{
        return item._id !== id
      })
      this.setState({
        ...this.state,
        list: updatedList
      })
    }
  }).catch((error)=>{
    console.log(error)
  })
}
  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep,title,list, description, activePage,itemsPerPage} = this.state;
    // Logic for displaying current items
      const indexOfLastItems = activePage * itemsPerPage;
      const indexOfFirstItems = indexOfLastItems - itemsPerPage;
      const currentItems = list.slice(indexOfFirstItems, indexOfLastItems);

      const renderItems = currentItems.map((item, index) => {
        return <div className={classes.margin}>
               <div className="card w-75">
                <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <button onClick={()=>this.deleteItem(item._id)} className="btn btn-warning">DELETE</button>
                </div>
                </div>
                </div>
      });

    return (

      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={activeStep === steps.length - 1 ? this.sendListItem : this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'SUBMIT' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>

          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>


            {renderItems}

            </Typography>
            <Pagination
           activePage={this.state.activePage}
           itemsCountPerPage={5}
           totalItemsCount={75}
           pageRangeDisplayed={3}
           onChange={this.handlePageChange}
         />
            <div className="addItemBtn">
            <Button onClick={this.handleReset} className={classes.button}>
              ADD NEW ITEM
            </Button>
            </div>
          </Paper>


      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);
