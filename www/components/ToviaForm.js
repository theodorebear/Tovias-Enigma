// see https://facebook.github.io/react/docs/forms.html for form documentation

import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Dialog from 'react-toolbox/lib/dialog';

const datetime = new Date();

class ToviaForm extends React.Component {
	
  	constructor() {
  	
  		super();
  		
  		// bind this to each function
  		this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleDialogToggle = this.handleDialogToggle.bind(this);
	    this.handleDecrypt = this.handleDecrypt.bind(this);
	    
	    // set initial state
  		this.state = {
  			name: '', 
  			multiline: '', 
  			date2: datetime,
			dialogActive: false,
			dialogActions: [
				{ label: "Close", onClick: this.handleDialogToggle },
				{ label: "Decrypt", onClick: this.handleDecrypt }
			],
			dialogMultiline:'',
		};
		
  		
  	}
  	
  	handleDialogToggle() {
  	
  		// if opening window, empty input
  		var dml = this.state.dialogMultiline;
  		if(!this.state.dialogActive) {
  			dml = "";
  		}
  		
  		// open/close dialog and reset input
		this.setState({
			dialogActive: !this.state.dialogActive,
			dialogMultiline: dml
		});
	}
	
	handleChange(name,value) {
	
		// updating an input in the form
		this.setState({[name]: value}, () => {
			//console.log("STATE UPDATED:", this.state);
		});
		
	}
	
	handleDecrypt() {
		
		var encrypted = this.state.dialogMultiline;
		
		var self = this;
		
		// fetch AJAX request to decrupt data
	    fetch(
	    	'/decrypt',
	    	{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({"message":encrypted})
			}
		)
		.then(function(response) {
			return response.text()
		}).then(function(body) {
			var response = JSON.parse(body);
			
			var b = response.data.date2.split(/\D+/);
			var date = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));

			
			console.log("DECRYPT RESPONSE",response.data);
			self.setState({
				dialogActive: false,
				name: response.data.name,
				multiline: response.data.multiline,
				date2: date,
			});
		});
		
		
	}
	
	handleSubmit(e) {
	    e.preventDefault();
	    
	    var self = this;
	    
	    // fetch AJAX request to encrypt data
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
			
			console.log("ENCRYPT RESPONSE",response);
			
			self.setState({
				dialogActive: true,dialogMultiline: response.data
			});
		});
	}
	
	render() {
		return (
			<form id="tovia-form" onSubmit={this.handleSubmit}>
				<h1>{this.props.title}</h1>
				<Input type='text' label='Name' name='name' required value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
				<Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
				<DatePicker label='Expiration date' sundayFirstDayOfWeek minDate={datetime} required onChange={this.handleChange.bind(this, 'date2')} value={this.state.date2} />
				<Button label="Encrypt" type="submit" />
				
				<Button label='Decrypt' onClick={this.handleDialogToggle} />
				<Dialog
				  actions={this.state.dialogActions}
				  active={this.state.dialogActive}
				  onEscKeyDown={this.handleDialogToggle}
				  onOverlayClick={this.handleDialogToggle}
				  title='De/Encrypt'
				>
				  <Input type='text' multiline label='Message' name='dialogMultiline' required value={this.state.dialogMultiline} onChange={this.handleChange.bind(this, 'dialogMultiline')} />
				</Dialog>
			</form>
		)
	};
}


module.exports = ToviaForm;