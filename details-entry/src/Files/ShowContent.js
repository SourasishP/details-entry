import React from 'react';
import "../styles/details_look.css";

export default function ShowContent(props){
	function cls_fl_upl()
	{
		document.getElementById("show_content").style.display="none";
	}
	return (
	<>
		<div className="show_fl_upl" id="show_content">
			<div className="show_fl_upl_content">
				<div className="show_fl_upl_head">{props.show_h}<span className="cls_show_fl_upl" onClick={cls_fl_upl}>x</span></div>
				<hr style={{height:"3px",color:"#8B4000"}}/>
				<p className="show_fl_content" style={{display:"inline"}}>{props.showc}</p>
			</div>
		</div>
	</>
	);
}