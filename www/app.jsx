import React from 'react';
import ReactDOM from 'react-dom';

var ToviaForm = require("./components/ToviaForm");

// add application to DOM
ReactDOM.render(
	<ToviaForm title="Tovia's Enigma" password={location.hash.replace("#","")} />,
	document.getElementById('app')
);
