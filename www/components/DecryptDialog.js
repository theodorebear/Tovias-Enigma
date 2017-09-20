import React from 'react';
import Button from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';

class DecryptDialog extends React.Component {

  	constructor() {
  		super();
  		
  		this.handleToggle = this.handleToggle.bind(this);
  		
  		
  		this.state = {
			active: false,
			actions: [
				{ label: "Cancel", onClick: this.handleToggle },
				{ label: "Save", onClick: this.handleToggle }
			],
			multiline:'',
		};
  		
  		
		// this.handleSubmit = this.handleSubmit.bind(this);
  	}

	handleToggle() {
		this.setState({active: !this.state.active});
	}
	render () {
		return (
		  <div>
			<Button label='Decrypt' onClick={this.handleToggle} />
			<Dialog
			  actions={this.state.actions}
			  active={this.state.active}
			  onEscKeyDown={this.handleToggle}
			  onOverlayClick={this.handleToggle}
			  title='De/Encrypt'
			>
			  <Input type='text' multiline label='Message' required maxLength={120} value={this.state.multiline} onChange={this.handleChange.bind(this, 'multiline')} />
			</Dialog>
		  </div>
		);
	}
}


module.exports = DecryptDialog;