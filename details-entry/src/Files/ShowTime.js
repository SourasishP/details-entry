import React,{ useState,useEffect,useRef } from 'react';
import "../styles/details_look.css";

export default function ShowTime(){
	const [show_tm,setShow_tm]=useState();
	var tm=new Date();
	var h=tm.getHours();
	var m=tm.getMinutes();
	var s=tm.getSeconds();
	var show_h="";
	var show_m="";
	var show_s="";
	const show_time=useRef(()=>{
		var k="";
		s+=1;
		if(s>=60)
		{
			s=0;
			m=m+1;
		}
		if(m>=60)
		{
			m=0;
			h=h+1;
		}
		if(h<10)
			show_h="0"+h;
		else if(h>=10)
			show_h=""+h;
		if(m<10)
			show_m="0"+m;
		else if(m>=10)
			show_m=""+m;
		if(s<10)
			show_s="0"+parseInt(s);
		else if(s>=10)
			show_s=""+parseInt(s);
		k=show_h+":"+show_m+":"+show_s;
		setShow_tm(k);
	});
	useEffect(()=>{
		setInterval(show_time.current,1000);
	},[]);
	return (
		<>
			{show_tm}
		</>
	);
}