import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';


const datetime = new Date();


class ToviaForm extends React.Component {
	

  	constructor() {
  		super();
  		this.state = {
  			name: '', multiline: '', date2: datetime
  		}
  		
  		this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
  	}
	
	handleChange(name,value) {
		this.setState({[name]: value}, () => {
			console.log("STATE UPDATED:", this.state);
		});
	}
	
	handleSubmit(e) {
	    e.preventDefault();
	    
	    // fetch AJAX request for data
	    fetch(
	    	'/encrypt',
	    	{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.state)
			}
		)
		.then(function(response) {
			return response.text()
		}).then(function(body) {
			var response = JSON.parse(body);
			alert(response.data);
		});
	}
	
	render() {
		return (
			<form id="tovia-form" onSubmit={this.handleSubmit}>
				<h1>{this.props.title}</h1>
				<Input type='text' label='Name' name='name' required value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
				<Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
				<DatePicker label='Expiration date' sundayFirstDayOfWeek required onChange={this.handleChange.bind(this, 'date2')} value={this.state.date2} />
				<Button label="Encrypt" type="submit" />
				<Button label="Decrypt" />
			</form>
		)
	};

}



module.exports = ToviaForm;