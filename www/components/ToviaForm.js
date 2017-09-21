import React from 'react';

// react-toolbox components
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Dialog from 'react-toolbox/lib/dialog';

// clipboard component
import copy from 'copy-to-clipboard';

// random string generator component
var randomstring = require("randomstring");

// set up initial variables
var today = new Date();
var ms = today.getTime() + 86400000;
var tomorrow = new Date(ms);

class ToviaForm extends React.Component {
	
  	constructor(props) {
  	
  		super(props);
  		
  		// bind this to each function
  		this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleDialogToggle = this.handleDialogToggle.bind(this);
	    this.handleDialogFailureToggle = this.handleDialogFailureToggle.bind(this);
	    this.handleDecrypt = this.handleDecrypt.bind(this);
	    this.passwordCopy = this.passwordCopy.bind(this);
	    this.passwordGenerate = this.passwordGenerate.bind(this);
	    
	    
	    // set initial state
  		this.state = {
  			name: '', 
  			multiline: '', 
  			date2: tomorrow,
			dialogActive: false,
			dialogFailureActive: false,
			dialogActions: [
				{ label: "Close", onClick: this.handleDialogToggle },
				{ label: "Decrypt", onClick: this.handleDecrypt }
			],
			dialogFailureActions: [
				{ label: "Close", onClick: this.handleDialogFailureToggle },
			],
			dialogMultiline:'',
			password:this.props.password,
			copyTooltipText:"Click to copy to clipboard",
		};
		
  		
  	}
  	
	/*
  	*
  	*			componentDidMount(): called when the component mounts for the first time - used to check password
  	*
  	*/
	componentDidMount() {
		if(!this.state.password) {
			var password = randomstring.generate(5);
			window.history.replaceState(null, null, "#"+password);
			this.setState({password:password});
		}
	}
  	
  	/*
  	*
  	*			handleDialogToggle(): used when the encrypt/decrypt popup is opening or closing
  	*
  	*/
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
	
  	/*
  	*
  	*			handleDialogFailureToggle(): used when the encrypt/decrypt failure notification popup is opening or closing
  	*
  	*/
	handleDialogFailureToggle() {
  		// open/close dialog
  		if(!this.state.dialogFailureActive) {
  			this.setState({
				dialogActive: false,
				dialogFailureActive: true,
			});
  		} else {
  			this.setState({
				dialogActive: false,
				dialogFailureActive: false,
			});
  		}
		
	}
	
	/*
  	*
  	*			handleChange(): called when any input in the form changes to maintain state data
  	*
  	*/
	handleChange(name,value) {
	
		// updating an input in the form
		this.setState({[name]: value}, () => {
			//console.log("STATE UPDATED:", this.state);
		});
		
	}
	
	/*
  	*
  	*			handleDecrypt(): used when the decrypt button is pressed, decrypts message
  	*
  	*/
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
				body: JSON.stringify({"password":self.state.password,"message":encrypted})
			}
		)
		.then(function(response) {
			return response.text()
		}).then(function(body) {
			var response = JSON.parse(body);
			
			if(response.success) {
			
				var b = response.data.date2.split(/\D+/);
				var date = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
				
				self.setState({
					dialogActive: false,
					name: response.data.name,
					multiline: response.data.multiline,
					date2: date,
				});
			} else {
				self.handleDialogFailureToggle();
				
				self.setState({
					dialogActive: false,
					name: "",
					multiline: "",
					date2: tomorrow,
				});
			}
		});
	}
	
	
	/*
  	*
  	*			handleSubmit(): used when the encrypt form is submitted, encrypting the object and displaying the dialog with the encrypted message
  	*
  	*/
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
	

	/*
  	*
  	*			passwordCopy(): copies the current password to the clipboard and displays success message
  	*
  	*/
	passwordCopy() {
		copy(this.state.password);
		this.setState({copyTooltipText:"Password copied!"});
		
		var self = this;
		setTimeout(function() {
			self.setState({copyTooltipText:"Click to copy to clipboard"});
		},5000);
	}
	
	/*
  	*
  	*			passwordGenerate(): creates a new random password
  	*
  	*/
	passwordGenerate() {
		var password = randomstring.generate(5);
		window.history.replaceState(null, null, "#"+password);
		this.setState({password:password});
	}
	
	
	/*
  	*
  	*			render()
  	*
  	*/
	render() {
		return (
			<div id="tovias-enigma">
				<form id="tovia-form" onSubmit={this.handleSubmit}>
					<h1>{this.props.title}</h1>
					<Input type='text' label='Name' name='name' autofocus required value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
					<Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
					<DatePicker label='Expiration date' sundayFirstDayOfWeek minDate={today} required onChange={this.handleChange.bind(this, 'date2')} value={this.state.date2} />
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
					
					<Dialog
					  actions={this.state.dialogFailureActions}
					  active={this.state.dialogFailureActive}
					  onEscKeyDown={this.handleDialogFailureToggle}
					  onOverlayClick={this.handleDialogFailureToggle}
					  title='Failed to De/Encrypt'
					>
					  <p>Your request was denied by the application.</p>
					</Dialog>
				</form>
				<div id="tovia-password">
					<div id="tovia-password-display">
						Your Passphrase: 
						<a onClick={this.passwordCopy}>
							{this.state.password}
							<div id="tovia-password-display-tooltip">
								{this.state.copyTooltipText}
							</div>
						</a>
					</div>
					<a id="tovia-password-generate" onClick={this.passwordGenerate}>
						Generate New Passphrase
					</a>
				</div>
			</div>
		)
	};
}


module.exports = ToviaForm;