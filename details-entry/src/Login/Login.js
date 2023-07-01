import React,{ useState,useEffect } from 'react';
import "../styles/look.css";
import show_image1 from "../Images/Image1.jpg";
import { useCookies } from 'react-cookie';
import { useNavigate,Link } from 'react-router-dom';
import Header from '../Files/Header';

export default function Login() {
	document.title="Details Entry Portal | Login";
	const [err,setErr]=useState("");
	const [cookies,setCookie]=useCookies(["Uname"]);
	var nav=useNavigate();
	
	useEffect(()=>{
		const checkLoggedIn=()=>{
			if(cookies.Uname)
			{
				nav("/Details");
				alert("Logged In as: "+cookies.Uname);
			}
		};
		checkLoggedIn();
	},[cookies.Uname,nav]);
	
	
	const handleReset=()=>{
		setErr("");
		document.getElementById("psd-label").style.display="none";
		document.getElementById("user-psd").style.display="none";
		document.getElementById("user-psd").value="";
		document.getElementById("user-email").value="";
		document.getElementById("user-psd").required=false;
		document.getElementById("user-email").disabled=false;
		document.getElementById("user-email").focus();
	};
	
	const handleLogin=async (e)=>{
		e.preventDefault();
		setErr("");
		var uemail=document.getElementById("user-email").value;
		var upsd=document.getElementById("user-psd").value;
		const udetails={
			uemail:uemail,
			upsd:upsd
		};
		if(uemail!=="" && upsd!=="")
		{
			await fetch("/validateUser",{
					method:'POST',
					headers: {'Content-Type': 'application/json'},
					body:JSON.stringify(udetails)
				})
			.then((res)=>{
				return res.json();
			})
			.then((data)=>{
				if(data.status===0)
				{
					setErr(data.result);
				}
				else
				{
					var dt=new Date();
					var dt1=new Date();
					dt=dt.setHours(23,59,59,0);
					var df=Math.abs(dt-dt1);
					df=Math.floor(df/1000)+1;
					setCookie("Uname",uemail,{path:"/",maxAge:df});
					//alert(data.result);
				}
			});
		}
		else if(upsd==="")
		{
			await fetch("/checkUser",{
					method:'POST',
					headers: {'Content-Type': 'application/json'},
					body:JSON.stringify(udetails)
				})
			.then((res)=>{
				return res.json();
			})
			.then((data)=>{
				if(data.status===0)
				{
					setErr(data.result);
				}
				else if(data.status===1)
				{
					setErr("");
					document.getElementById("psd-label").style.display="block";
					document.getElementById("user-psd").style.display="block";
					document.getElementById("user-psd").required=true;
					document.getElementById("user-email").disabled=true;
					document.getElementById("user-psd").focus();
				}
			});
		}
	};
	return (
	<>
		<Header show="Login"/>
		<div className="content">
			<div className="left_content">
				<p className="show">Please login to see, test and enjoy all the features.</p>
				<form id="login" name="login" method="post" style={{padding:"10px 10px",height:"100%"}} onSubmit={handleLogin}>
					<label className="form-label">Email:</label>
					<input type="email" name="user-email" id="user-email" placeholder="Enter Email" required autoFocus/>
					<label className="form-label" style={{marginTop:"10px",display:"none"}} id="psd-label">Password:</label>
					<input type="password" name="user-psd" id="user-psd" style={{display:"none"}} placeholder="Enter Password" />
					<p className="show-err">{err}</p>
					<button type="submit" className="btn btn-success">Next</button>&nbsp;&nbsp;&nbsp;&nbsp;
					<button type="button" onClick={handleReset} className="btn btn-danger">Reset</button>
					<p style={{marginTop:"10px",fontWeight:"bold"}}>Account not present? <Link style={{color:"blue"}} to="/Register">Create Account</Link></p>
				</form>
			</div>
			<div className="right_content">
				<img src={show_image1} height="550px" width="100%" alt="Left Image1"/>
			</div>
		</div>
	</>
	);
}