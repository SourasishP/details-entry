import React,{ useState,useEffect,useRef } from 'react';
import "../styles/look.css";
import "../styles/details_look.css";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ShowTime from './ShowTime';
import ShowFolderContents from './ShowFolderContents';

export default function Details() {
	document.title="Details Entry Portal";
	const load=useRef(false);
	const [cookies,setCookie]=useCookies(["Uname"]);
	const [uname,setUname]=useState();
	var u=cookies.Uname;
	const [uid,setUid]=useState();
	const [fl,setFl]=useState();
	const [show_h,setShow_h]=useState();
	const [showc,setShowc]=useState();
	const [showfld,setShowfld]=useState();
	const [fld,setFld]=useState([]);
	const [filename,setFilename]=useState();
	const [fl_pth,setFl_pth]=useState();
	const [fld_id,setFld_id]=useState("NULL");
	const [fld_nm_a,setFld_nm_a]=useState("");
	const [fn,setFn]=useState(1);
	var nav=useNavigate();
	useEffect(()=>{
		if(load.current===false)
		{
			setTimeout(()=>{
				document.getElementById("show_tm").style.display="block";
			},2000);
			setShow_h("NOTICE");
			setShowc("Getting User Details...Please Wait...");
			document.getElementById("show_fl_upl").style.display="block";
			document.getElementById("show_fl_content").style.display="block";
			const checkLoggedIn=()=>{
				if(cookies.Uname===false)
				{
					nav("/Login");
					alert("Please Login");
				}
			};
			checkLoggedIn();
			const getUserDetails=async()=>{
				if(cookies.Uname)
				{
					var uemail=cookies.Uname;
					await fetch("/getUserDetails?user="+uemail,{
						method:'GET',
						headers: {'Content-Type': 'application/json'},
					})
					.then((res)=>{
					return res.json();
					})
					.then((data)=>{
						if(data.status!==0)
						{
							setUname(data.result[0].uname);
							setUid(data.result[0].user_id);
							setFl(data.result[0].fl_id);
							setFl_pth(data.result[0].fl_id);
							document.getElementById("show_fl_upl").style.display="none";
							document.getElementById("show_fl_content").style.display="none";
						}
					});
				}
			};
			getUserDetails();
			getUserFolders.current();
			load.current=true;
		}
	},[cookies.Uname,nav,uid]);
	var k=0;
	const getUserFolders=useRef(async()=>{
		if(cookies.Uname)
		{
			var uemail=cookies.Uname;
			const udetails={
				uemail:uemail
			};
			await fetch("/getUserFolders",{
				method:"POST",
				headers: {'Content-Type': 'application/json'},
				body:JSON.stringify(udetails)
			})
			.then((res)=>{
				return res.json();
			})
			.then((data)=>{
				if(data.status===0)
				{
					setShowfld("No Folders Created");
					document.getElementById("show_fld").style.display="none";
				}
				else
				{
					document.getElementById("show_fld").style.display="table";
					setShowfld("Number of folders: "+data.result.length);
					setFld(data.result);
				}
			});
		}
	});
	const show_crt_fl=(t)=>{
		if(t===0)
		{
			setShow_h("Create Folder");
			document.getElementById("crt_fl_nm").style.display="block";
			document.getElementById("upl_fl").style.display="none";
			document.getElementById("fl_nm").value="";
			document.getElementById("fl_nm").focus();
		}
		else if(t===1)
		{
			setShow_h("Upload File");
			document.getElementById("crt_fl_nm").style.display="none";
			document.getElementById("upl_fl").style.display="block";
			document.getElementById("upl_fl").reset();
		}
		document.getElementById("show_fl_content").style.display="none";
		document.getElementById("show_fl_upl").style.display="block";
	};
	const crt_fl=async (e)=>{
		e.preventDefault();
		var fl_nm=document.getElementById("fl_nm").value;
		if(fl_nm!=="")
		{
			const udetails={
				uemail:u,
				uid:uid,
				fl:fl,
				fld_nm:fl_nm
			};
			await fetch("/crt_fld",{
				method:'POST',
				headers: {'Content-Type': 'application/json'},
				body:JSON.stringify(udetails)
			})
			.then((res)=>{
				return res.json();
			})
			.then((data)=>{
				setShowc(data.result);
				document.getElementById("crt_fl_nm").style.display="none";
				document.getElementById("show_fl_content").style.display="block";
				if(data.status===1)
				{
					getUserFolders.current();
				}
			});
		}
	};
	const dlt_fld=async(fld_nm)=>{
		const udetails={
			uid:uid,
			fl:fl,
			fld_nm:fld_nm
		};
		await fetch("/dlt_fld",{
			method:'POST',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify(udetails)
		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			document.getElementById("show_fl_upl").style.display="block";
			document.getElementById("show_fl_content").style.display="block";
			document.getElementById("upl_fl").style.display="none";
			document.getElementById("crt_fl_nm").style.display="none";
			if(data.status===0)
			{
				setShow_h("FAILURE");
			}
			else if(data.status===1)
			{
				setShow_h("SUCCESS");
				getUserFolders.current();
			}
			setShowc(data.result);
		});
	};
	const handleFile=(e)=>{
		setFilename(e.target.files[0]);
	};
	const upl_fl=async (e)=>{
		e.preventDefault();
		document.getElementById("show_fl_upl").style.display="block";
		document.getElementById("show_fl_content").style.display="block";
		document.getElementById("upl_fl").style.display="none";
		setShow_h("NOTICE");
		setShowc("Uploading File...Please Wait...");
		let data=new FormData();
		data.append('file',filename);
		const pth=fl_pth;
		data.append("fld_pth",pth);
		data.append("uid",uid);
		data.append("fld_id",fld_id);
		await fetch("/uploadFile",{
			method:'POST',
			body:data
		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			document.getElementById("upl_fl").style.display="none";
			document.getElementById("crt_fl_nm").style.display="none";
			if(data.status===0)
			{
				setShow_h("FAILURE");
			}
			else if(data.status===1)
			{
				setShow_h("SUCCESS");
			}
			setShowc(data.result);
			setFn(Math.random());
		});
	};
	
	const changepth=async (fld_nm)=>{
		setFl_pth(fl_pth+"/"+fld_nm);
		document.getElementById("show_fld_container").style.display="none";
		document.getElementById("crt_fld").style.display="none";
		await fetch("/getFolderID?fld_nm="+fld_nm+"&uid="+uid,{
			method:"GET"
		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			setFn(Math.random());
			setFld_id(data.result);
			setFld_nm_a(fld_nm);
			document.getElementById("show_logout").style.display="none";
			document.getElementById("show_home").style.display="block";
		});
	};
	function cls_fl_upl()
	{
		document.getElementById("show_fl_upl").style.display="none";
	}
	const logout=()=>{
		var df=0;
		setCookie("Uname","",{path:"/",maxAge:df});
		nav("/Login");
	};
	const show_home=()=>{
		document.getElementById("show_fld_container").style.display="block";
		document.getElementById("crt_fld").style.display="inline";
		document.getElementById("show_logout").style.display="block";
		document.getElementById("show_home").style.display="none";
		setFld_nm_a("");
		setFld_id("NULL");
		setFl_pth(fl);
		getUserFolders.current();
		setFn(Math.random());
	};
	
	return (
	<>
		<Header show=""/>
		<div className="show_fl_upl" id="show_fl_upl">
			<div className="show_fl_upl_content" id="show_fl_upl_content">
				<div className="show_fl_upl_head">{show_h}<span className="cls_show_fl_upl" onClick={cls_fl_upl}>x</span></div>
				<hr style={{height:"3px",color:"#8B4000"}}/>
				<form id="crt_fl_nm" name="crt_fl_nm" method="post" onSubmit={crt_fl} style={{display:"none"}}>
					<label className="form-label">Enter Folder Name:</label>
					<input type="text" name="fl_nm" id="fl_nm" placeholder="Enter Folder Name" maxLength="30" required autoComplete="off"/><br/><br/>
					<button type="submit" className="btn btn-success">Create</button>
				</form>
				<p className="show_fl_content" id="show_fl_content">{showc}</p>
				<form id="upl_fl" name="upl_fl" method="post" encType="multipart/form-data" style={{display:"none"}}>
					<input className="form-control" type="file" id="fl_nm_upl" name="fl_nm_upl" onChange={handleFile}/><br/><br/>
					<button type="submit" className="btn btn-success" onClick={upl_fl}>Upload</button>
				</form>
			</div>
		</div>
		<div className="show">
			<div className="show_content_left_content" style={{paddingRight:"15px"}}><b>Name:</b><span style={{marginLeft:"5px"}}>{uname}</span></div>
			<div className="show_content_left_content" style={{marginLeft:"15px",paddingRight:"15px"}}><b>Email:</b><span style={{marginLeft:"5px"}}>{u}</span></div>
			<div className="show_content_left_content" style={{marginLeft:"15px",paddingRight:"15px"}}><b>Folder ID:</b><span style={{marginLeft:"5px"}}>{fl}</span></div>
			<div className="show_content_left_content" style={{marginLeft:"15px",border:"0",display:"none"}} id="show_tm"><b>Time:</b><span style={{marginLeft:"5px"}}><ShowTime/></span></div>
		</div><br/>
		
		<div style={{margin:"0 5px 0 5px"}}><button type="button" className="btn btn-primary" onClick={()=>show_crt_fl(0)} id="crt_fld">New Folder</button>&nbsp;&nbsp;<button type="button" className="btn btn-outline-secondary" onClick={()=>show_crt_fl(1)} id="crt_fl">New File</button>
		<span style={{float:"right"}}><button className="btn btn-danger" onClick={show_home} id="show_home" style={{display:"none"}}>Home</button>
		<button className="btn btn-danger" onClick={logout} id="show_logout">Logout</button></span></div>
		
		<div className="show_fld_container" id="show_fld_container">
			<div className="show_fld_head">Folder List</div>
			<p className="show_fld_num">{showfld}</p>
			<table cellSpacing="2px" cellPadding="7px" className="show_fld" id="show_fld">
				<thead><tr><th>Sl. No.</th><th>Name</th><th>Size</th><th>Date Created</th><th>Type</th><th>Action</th></tr></thead>
				<tbody>
				{fld.map((f,i)=>
					<tr key={i}><td>{++k}</td>
					<td className="fld_nm" onClick={()=>changepth(f.fld_nm)}>{f.fld_nm}</td>
					<td>{f.size} File(s)</td>
					<td>{new Date(f.date).toLocaleString()}</td>
					<td>Folder</td><td className="fld_nm" onClick={()=>dlt_fld(f.fld_nm)}>Delete</td></tr>)
				}
				</tbody>
			</table>
		</div>
		
		<ShowFolderContents key={fn} fld_id={fld_id} uid={uid} fld_nm={fld_nm_a} uemail={u} fl={fl} fl_pth={fl_pth} />
	</>
	);
}