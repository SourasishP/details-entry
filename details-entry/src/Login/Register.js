import React,{ useState } from 'react';
import "../styles/look.css";
import { useNavigate,Link } from 'react-router-dom';
import Header from '../Files/Header';
import ShowContent from "../Files/ShowContent"

export default function Register() {
	document.title="Details Entry Portal | Register";
	const [err,setErr]=useState("");
	const nav=useNavigate();
	const handleCheckUser=async (e)=>{
		e.preventDefault();
		setErr("");
		var uemail=document.getElementById("user-email").value;
		const udetails={
			uemail:uemail,
			upsd:""
		};
		await fetch("/checkUser",{
			method:'POST',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify(udetails)
		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			if(data.status===1)
			{
				setErr("Account already exist with given Email. Please Login");
			}
			else if(data.status===0 && data.result==="Account does not exist. Please create one.")
			{
				document.getElementById("check_user").style.display="none";
				document.getElementById("register_user").style.display="block";
				document.getElementById("user-email_r").value=uemail;
				document.getElementById("user-uname").focus();
			}
			else if(data.status===0)
			{
				setErr(data.result);
			}
		});
	};
	
	const handleRegistration=async (e)=>{
		e.preventDefault();
		setErr("");
		var uemail=document.getElementById("user-email_r").value;
		var uname=document.getElementById("user-uname").value;
		var psd=document.getElementById("user-psd").value;
		var cnf_psd=document.getElementById("cnf-psd").value;
		document.getElementById("show_content").style.display="block";
		if(psd!==cnf_psd)
		{
			setErr("Password and Confirm Password must be same.");
			document.getElementById("user-psd").value="";
			document.getElementById("cnf_psd").value="";
			document.getElementById("user-psd").focus();
		}
		else
		{
			const udetails={
				uname:uname,
				uemail:uemail,
				upsd:psd
			}
			await fetch("/registerUser",{
				method:'POST',
				headers: {'Content-Type': 'application/json'},
				body:JSON.stringify(udetails)
			})
			.then((res)=>{
				return res.json();
			})
			.then((data)=>{
				if(data.status===1)
				{
					alert("User Registered Successfully");
					nav("/Login");
				}
				else if(data.status===0)
				{
					setErr(data.result);
				}
			});
		}
	};
	return (
	<>
		<Header show="Register"/>
		<ShowContent show_h="NOTICE" showc="Registering User...Please Wait..." />
				<p className="show">Registration is the first step.</p>
				<form id="check_user" name="check_user" method="post" style={{padding:"10px 10px"}} onSubmit={handleCheckUser}>
					<label className="form-label">Email:</label>
					<input type="email" name="user-email" id="user-email" placeholder="Enter Email" required autoFocus/>
					<p className="show-err">{err}</p>
					<div id="show-button">
						<button type="submit" className="btn btn-success">Next</button>&nbsp;&nbsp;&nbsp;&nbsp;
						<Link style={{color:"blue",fontWeight:"bold"}} to="/Login">Login</Link>
					</div>
				</form>
				<form id="register_user" name="register_user" method="post" style={{padding:"10px 10px",display:"none"}} onSubmit={handleRegistration}>
					<label className="form-label">Name:</label>
					<input type="text" name="user-uname" id="user-uname" placeholder="Enter Name" required/><br/>
					<label className="form-label">Email:</label>
					<input type="email" name="user-email_r" id="user-email_r" placeholder="Enter Email" style={{color:"blue",fontWeight:"bold"}} required disabled/><br/>
					<label className="form-label">Password:</label>
					<input type="password" name="user-psd" id="user-psd" placeholder="Enter Password" required/><br/>
					<label className="form-label">Confirm Password:</label>
					<input type="password" name="cnf-psd" id="cnf-psd" placeholder="Confirm Password" required/>
					<p className="show-err">{err}</p>
					<button type="submit" className="btn btn-success">Register</button>&nbsp;&nbsp;&nbsp;&nbsp;
					<button type="button" className="btn btn-danger">Reset</button>
				</form>
	</>
	);
}