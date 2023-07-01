import React,{ useState,useEffect,useRef } from 'react';
import "../styles/look.css";
import "../styles/details_look.css";

export default function ShowFolderContents(props){
	const [showfl,setShowfl]=useState();
	const [fl_data,setFl_data]=useState([]);
	useEffect(()=>{
		getUserFiles.current();
	},[]);
	const getUserFiles=useRef(async()=>{
		const udetails={
			uemail:props.uemail,
			fld_id:props.fld_id
		};
		await fetch("/getUserFiles",{
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
				setShowfl("No Files Created");
				document.getElementById("show_fl").style.display="none";
			}
			else
			{
				document.getElementById("show_fl").style.display="table";
				setShowfl("Number of files: "+data.result.length);
				setFl_data(data.result);
			}
		});
	});
	
	const downloadFile=async (fl_nm)=>{
		window.open("/downloadFile?pth="+props.fl_pth+"&fl_nm="+fl_nm);
	};
	
	const dlt_fl=async(fl_nm)=>{
		const udetails={
			uid:props.uid,
			fl:props.fl_pth,
			fl_nm:fl_nm,
			fld_id:props.fld_id
		};
		await fetch("/dlt_fl",{
			method:'POST',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify(udetails)
		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			getUserFiles.current();
		});
	};
	
	var l=0;
	return (
	<>
		<div className="show_fld_container">
			<div className="show_fld_head">File List</div>
			<p className="show_fld_num">{showfl}<span style={{float:"right",fontWeight:"bold"}}>{props.fld_nm==="" ? "" : "Folder Name: "+props.fld_nm}</span></p>
			<table cellSpacing="2px" cellPadding="7px" className="show_fld" id="show_fl">
				<thead><tr><th>Sl. No.</th><th>Name</th><th>Type</th><th>File Size</th><th>Date Created</th><th>Action</th></tr></thead>
				<tbody>
				{fl_data.map((f,i)=>
					<tr key={i}><td>{++l}</td>
					<td className="fld_nm" onClick={()=>downloadFile(f.fl_nm)}>{f.fl_nm}</td>
					<td>{f.fl_type}</td>
					<td>{f.fl_size} MB</td>
					<td>{new Date(f.date).toLocaleString()}</td>
					<td className="fld_nm" onClick={()=>dlt_fl(f.fl_nm)}>Delete</td></tr>)
				}
				</tbody>
			</table>
		</div>
	</>
	);
}