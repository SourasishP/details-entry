const express=require("express");
const mysql=require("mysql");
const fs=require("fs");
const db_conn=require("./required_files/config");
const cors=require("cors");
const app=express();
const multer=require("multer");
const path=require("path");
const port_addr=3001;
app.use(cors());
app.use(express.json());

function makeConnection()
{
	db_conn.connect(function(err){
		if(err)
		{
			console.log(err);
		}
	});
}
makeConnection();
app.get("/checkConnection", (req,res)=>{
	if(db_conn.state==="authenticated")
		res.send("Connected");
	else
		res.send(db_conn.state)
});

app.get("/getUsers",(req,res)=>{
	if(db_conn.state==="authenticated")
	{
		var q="SELECT uname,email,password,status FROM users";
		db_conn.query(q,function(err,rst){
			if(err)
			{
				console.log(err);
			}
			else
			{
				res.send(rst[0]);
			}
		});
	}
	else
	{
		makeConnection();
		res.send("Can't connect to database");
	}
});

app.post("/checkUser",(req,res)=>{
	var uemail=req.body.uemail;
	if(db_conn.state==="authenticated")
	{
		var q="SELECT email FROM users WHERE email="+mysql.escape(uemail);
		db_conn.query(q,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst.length===0)
				{
					res.send(JSON.stringify({"status":0,"result":"Account does not exist. Please create one."}));
				}
				else if(rst.length===1)
				{
					res.send(JSON.stringify({"status":1}));
				}
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/registerUser",(req,res)=>{
	var uname=req.body.uname;
	var uemail=req.body.uemail;
	var upsd=req.body.upsd;
	if(db_conn.state==="authenticated")
	{
		const fl=Math.round(Math.random()*(999999-100000)+100000)
		const nw_fl="./User_Files/"+fl;
		var q="INSERT INTO users (uname,email,password,fl_name) VALUES (?)";
		var lst=[uname,uemail,upsd,fl];
		db_conn.query(q,[lst],function(err,rst){
			fs.mkdir(nw_fl,(err)=>{
				if(err)
				{
					console.log(err);
					res.send(JSON.stringify({"status":0,"result":"Something went wrong. Please try again later."}));
				}
				else
				{
					if(err)
					{
						console.log(err);
						res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
					}
					else if(rst.affectedRows===1)
					{
						res.send(JSON.stringify({"status":1}));
					}
					else
					{
						res.send(JSON.stringify({"status":0,"result":"Something went wrong. Please try again later."}));
					}
				}
			});
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/validateUser",(req,res)=>{
	//console.log(req.body.uemail);
	var uemail=req.body.uemail;
	var upsd=req.body.upsd;
	if(db_conn.state==="authenticated")
	{
		var q="SELECT status,password FROM users WHERE email="+mysql.escape(uemail);
		db_conn.query(q,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst.length===0)
				{
					res.send(JSON.stringify({"status":0,"result":"Account does not exist. Please create one."}));
				}
				else
				{
					if(rst[0].password!==upsd)
					{
						res.send(JSON.stringify({"status":0,"result":"Invalid Password. Please try again."}));
					}
					else if(rst[0].password===upsd && rst[0].status!=="complete")
					{
						res.send(JSON.stringify({"status":0,"result":"Account Blocked"}));
					}
					else if(rst[0].password===upsd && rst[0].status==="complete")
					{
						res.send(JSON.stringify({"status":1,"result":"Logged In Successfully"}));
					}
				}
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.get("/getUserDetails",(req,res)=>{
	var uemail=req.query.user;
	if(db_conn.state==="authenticated")
	{
		var q="SELECT id,uname,fl_name FROM users WHERE email="+mysql.escape(uemail);
		db_conn.query(q,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				res.send(JSON.stringify({"status":1,"result":[{"user_id":rst[0].id,"uname":rst[0].uname,"fl_id":rst[0].fl_name}]}));
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/crt_fld",(req,res)=>{
	var uemail=req.body.uemail;
	var uid=req.body.uid;
	var fl=req.body.fl;
	var fld_nm=req.body.fld_nm;
	var p=1;
	if(db_conn.state==="authenticated")
	{
		var q_f="SELECT id FROM user_fld WHERE fld_nm="+mysql.escape(fld_nm)+" and user_id="+mysql.escape(uid);
		db_conn.query(q_f,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst.length===0)
				{
					p=0;
				}
				else if(rst.length>0)
				{
					p=1;
				}
			}
		});
		if(p===0)
		{
			res.send(JSON.stringify({"status":0,"result":"Please change the Folder Name"}));
		}
		else if(p===1)
		{
			const nw_fl="./User_Files/"+fl+"/"+fld_nm;
			fs.mkdir(nw_fl,(err)=>{
				if(err)
				{
					res.send(JSON.stringify({"status":0,"result":"Folder Creation Error"}));
				}
				else
				{
					var q_s="INSERT INTO user_fld (user_id,fld_nm) VALUES (?)";
					var lst=[uid,fld_nm];
					db_conn.query(q_s,[lst],function(err,rst){
						if(err)
						{
							console.log(err);
							res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
						}
						else
						{
							res.send(JSON.stringify({"status":1,"result":"Folder Created successfully"}));
						}
					});
				}
			});
		}
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/getUserFolders",(req,res)=>{
	var uemail=req.body.uemail;
	if(db_conn.state==="authenticated")
	{
		var q_f="SELECT A.fld_nm,A.size,A.date FROM user_fld a,users B WHERE B.email="+mysql.escape(uemail)+" and A.user_id=B.id";
		db_conn.query(q_f,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst.length===0)
				{
					res.send(JSON.stringify({"status":0,"result":"No Folder Found"}));
				}
				else
				{
					res.send(JSON.stringify({"status":1,"result":rst,"type":"folder"}));
				}
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/getUserFiles",(req,res)=>{
	var uemail=req.body.uemail;
	var fld_id=req.body.fld_id;
	if(db_conn.state==="authenticated")
	{
		if(fld_id==="NULL")
		{
			var q_f="SELECT A.fl_nm,A.fl_type,A.fl_size,A.date FROM user_fl A,users B WHERE B.email="+mysql.escape(uemail)+" and A.user_id=B.id and A.fld_id IS NULL";
		}
		else
		{
			var q_f="SELECT A.fl_nm,A.fl_type,A.fl_size,A.date FROM user_fl A,users B WHERE B.email="+mysql.escape(uemail)+" and A.fld_id="+mysql.escape(fld_id)+" and A.user_id=B.id";
		}
		db_conn.query(q_f,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst.length===0)
				{
					res.send(JSON.stringify({"status":0,"result":"No Files Found"}));
				}
				else
				{
					res.send(JSON.stringify({"status":1,"result":rst}));
				}
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

const storage=multer.diskStorage({
	destination:(req,file,cb)=>{
		cb(null,"./Temp_Files/");
	},
	filename:(req,file,cb)=>{
		cb(null,file.originalname);
	}
});

const upload=multer({storage:storage});

app.post("/uploadFile",upload.single('file'),function(req,res,next){
	var uid=req.body.uid;
	var fld_id=req.body.fld_id;
	const pth="./Temp_Files/"+req.file.originalname;
	const dpth="./User_Files/"+req.body.fld_pth+"/"+req.file.originalname;
	fs.rename(pth,dpth,(err)=>{
		if(err)
		{
			console.log(err);
			res.send(JSON.stringify({"status":0,"result":"Something went wrong. Please try again later."}));
		}
		else
		{
			if(db_conn.state==="authenticated")
			{
				var ty=((path.extname(req.file.originalname)).slice(1)).toUpperCase();
				var st=fs.statSync(dpth);
				var sz=st.size/(1024*1024);
				sz=sz.toFixed(2);
				if(fld_id==="NULL")
				{
					var q_f="INSERT INTO user_fl (user_id,fl_nm,fl_type,fl_size) VALUES (?)";
					var lst=[uid,req.file.originalname,ty,sz];
				}
				else
				{
					var q_f="INSERT INTO user_fl (user_id,fld_id,fl_nm,fl_type,fl_size) VALUES (?)";
					var lst=[uid,fld_id,req.file.originalname,ty,sz];
					var q_s="SELECT A.size,B.id FROM user_fld A,users B WHERE A.id="+mysql.escape(fld_id)+" and A.user_id=B.id";
					db_conn.query(q_s,function(err,rst){
						if(err)
						{
							console.log(err);
							res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
						}
						else
						{
							var p=rst[0].size+1;
							var i=rst[0].id;
							var q_t="UPDATE user_fld SET size="+mysql.escape(p)+" WHERE id="+mysql.escape(fld_id)+" and user_id="+mysql.escape(i);
							db_conn.query(q_t,function(err,rst){
								if(err)
								{
									console.log(err);
									res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
								}
							});
						}
					});
				}
				db_conn.query(q_f,[lst],function(err,rst){
					if(err)
					{
						console.log(err);
						res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
					}
					else
					{
						res.send(JSON.stringify({"status":1,"result":"File Uploaded Successfully"}));
					}
				});
			}
			else
			{
				makeConnection();
				res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
			}
		}
	});
});

app.post("/dlt_fld",(req,res)=>{
	var fld_nm=req.body.fld_nm;
	var uid=req.body.uid;
	var fl=req.body.fl;
	if(db_conn.state==="authenticated")
	{
		var q_f="SELECT size FROM user_fld WHERE fld_nm="+mysql.escape(fld_nm)+" and user_id="+mysql.escape(uid);
		db_conn.query(q_f,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				if(rst[0].size===0)
				{
					var q_s="DELETE FROM user_fld WHERE fld_nm="+mysql.escape(fld_nm)+" AND user_id="+mysql.escape(uid);
					db_conn.query(q_s,function(err,rst){
						if(err)
						{
							console.log(err);
							res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
						}
						else
						{
							const pth="./User_Files/"+fl+"/"+fld_nm;
							fs.rmdir(pth,(err)=>{
								if(err)
								{
									console.log("Error");
									res.send(JSON.stringify({"status":0,"result":"Folder "+fld_nm+" could not be deleted"}));
								}
								else
								{
									res.send(JSON.stringify({"status":1,"result":"Folder "+fld_nm+" deleted successfully"}));
								}
							});
						}
					});
				}
				else
				{
					res.send(JSON.stringify({"status":0,"result":"Please delete Folder contents to delete it"}));
				}
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.post("/dlt_fl",(req,res)=>{
	var fl_nm=req.body.fl_nm;
	var uid=req.body.uid;
	var fl=req.body.fl;
	var fld_id=req.body.fld_id;
	if(db_conn.state==="authenticated")
	{
		if(fld_id!=="NULL")
		{
			var q_f="DELETE FROM user_fl WHERE fl_nm="+mysql.escape(fl_nm)+" AND user_id="+mysql.escape(uid)+" and fld_id="+mysql.escape(fld_id);
			var q_s="SELECT size FROM user_fld WHERE id="+mysql.escape(fld_id)+" and user_id="+mysql.escape(uid);
			db_conn.query(q_s,function(err,rst){
				if(err)
				{
					console.log(err);
					res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
				}
				else
				{
					var p=rst[0].size-1;
					var q_t="UPDATE user_fld SET size="+mysql.escape(p)+" WHERE user_id="+mysql.escape(uid)+" and id="+mysql.escape(fld_id);
					db_conn.query(q_t,function(err,rst){
						if(err)
						{
							console.log(err);
							res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
						}
					});
				}
			});
		}
		else
		{
			var q_f="DELETE FROM user_fl WHERE fl_nm="+mysql.escape(fl_nm)+" AND user_id="+mysql.escape(uid)+" and fld_id IS NULL";
		}
		db_conn.query(q_f,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				const pth="./User_Files/"+fl+"/"+fl_nm;
				fs.unlink(pth,(err)=>{
					if(err)
					{
						console.log("Error");
						res.send(JSON.stringify({"status":0,"result":"File "+fl_nm+" could not be deleted"}));
					}
					else
					{
						res.send(JSON.stringify({"status":1,"result":"File "+fl_nm+" deleted successfully"}));
					}
				});
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.get("/downloadFile",(req,res)=>{
	const pth="./User_Files/"+req.query.pth+"/"+req.query.fl_nm;
	res.download(pth);
});

app.get("/getFolderID",(req,res)=>{
	var uid=req.query.uid;
	var fld_nm=req.query.fld_nm;
	if(db_conn.state==="authenticated")
	{
		var q="SELECT id FROM user_fld WHERE fld_nm="+mysql.escape(fld_nm)+" and user_id="+mysql.escape(uid);
		db_conn.query(q,function(err,rst){
			if(err)
			{
				console.log(err);
				res.send(JSON.stringify({"status":0,"result":"ERROR: Database Error"}));
			}
			else
			{
				res.send(JSON.stringify({"status":1,"result":rst[0].id}));
			}
		});
	}
	else
	{
		makeConnection();
		res.send(JSON.stringify({"status":0,"result":"ERROR: Can't establish connection with database"}));
	}
});

app.listen(port_addr, ()=>{
    console.log("Server is running on "+port_addr);
})