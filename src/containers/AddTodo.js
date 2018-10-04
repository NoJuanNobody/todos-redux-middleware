import React, {Component} from 'react'
import { connect } from 'react-redux'
import addTodoWithReminder from './middleware/addTodoThunk'
export class AddTodo extends Component{
  constructor(props){
    super(props);
    this.state = {
      inputValue:this.props.initialValue
    }

    this.handleTextChange = this.handleTextChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e){
    e.preventDefault()
        if (!this.state.inputValue.trim()) {
          return
        }
    // this.props.dispatch(addTodoWithReminder(this.state.inputValue));
    this.props.onSubmit(this.state.inputValue)
    this.setState({inputValue:""});
  }

  handleTextChange(e){
    this.setState({inputValue:e.target.value});
  }
  
  render(){
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input className="todo-input" value={this.state.inputValue} onChange={this.handleTextChange} />
          <button type="submit">
            Add Todo
          </button>
        </form>
      </div>
    )
  }
}

export default connect()(AddTodo)
