import React from 'react';
import ReactDOM from 'react-dom';

var ToviaForm = require("./components/ToviaForm");


ReactDOM.render(
	<ToviaForm title="Tovia's Enigma" password={location.hash.replace("#","")} />,
	document.getElementById('app')
);
