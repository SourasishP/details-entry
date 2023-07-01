import React from 'react';
import "../styles/look.css";

export default function Header(props){
	return (
	<>
		<div className="head"><div className="head_show">Details Entry Portal {props.show!=="" ? " | "+props.show : null}</div></div>
		<div className="fst_show"></div>
	</>
	);
}