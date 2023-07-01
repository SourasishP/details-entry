import React from 'react';
import "../styles/look.css";
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Home() {
	var nav=useNavigate();
	function showLogin()
	{
		nav("/Login");
	}
	return (
		<>
			<Header show=""/>
			<p className="show_content">
				Welcome to Details Entry Portal. Please login to continue.
			</p>
			<center><button className="btn btn-primary" onClick={showLogin}>Login</button></center>
		</>
	);	
};