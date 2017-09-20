import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';


const datetime = new Date(2015, 10, 16);
const min_datetime = new Date(new Date(datetime).setDate(8));
datetime.setHours(17);
datetime.setMinutes(28);


class ToviaForm extends React.Component {
	

  	constructor() {
  		super();
  		this.state = {
  			name: '', multiline: '', date2: datetime
  		}
  	}
	
	handleChange(name,value) {
		this.setState({[name]: value}, () => {
			console.log("STATE UPDATED:", this.state);
		});
	};
	render() {
		return (
			<form id="tovia-form">
				<h1>{this.props.title}</h1>
				<Input type='text' label='Name' name='name' required value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
				<Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
				<DatePicker label='Expiration date' sundayFirstDayOfWeek required minDate={min_datetime} onChange={this.handleChange.bind(this, 'date2')} value={this.state.date2} />
				<Button label="Encrypt" />
				<Button label="Decrypt" />
			</form>
		)
	};

}



module.exports = ToviaForm;