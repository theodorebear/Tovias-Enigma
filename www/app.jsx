import React from 'react';
import ReactDOM from 'react-dom';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';

const datetime = new Date(2015, 10, 16);
const min_datetime = new Date(new Date(datetime).setDate(8));
datetime.setHours(17);
datetime.setMinutes(28);

var formTitle = "Tovia's Enigma";

var ToviaForm = React.createClass({
	getInitialState:function() {
		return {
			name: '', multiline: '', date2: datetime
		}
	},
	handleChange:function(name,value) {
		this.setState({[name]: value}, () => {
			console.log("STATE UPDATED:", this.state);
		});
	},
	render:function() {
		return (
			<form id="tovia-form">
				<h1>{formTitle}</h1>
				<Input type='text' label='Name' name='name' required value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
				<Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
				<DatePicker label='Expiration date' sundayFirstDayOfWeek required minDate={min_datetime} onChange={this.handleChange.bind(this, 'date2')} value={this.state.date2} />
				<Button label="Encrypt" />
				<Button label="Decrypt" />
			</form>
		)
	},

});


ReactDOM.render(
	<ToviaForm />,
	document.getElementById('app')
);
