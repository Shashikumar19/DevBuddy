function adminAuth(req,res,next){
  const token = "xyz";
  if(token =="xyz"){
    next()
  }else{
    res.status(401).send("Unathorized Request")
  }
}

function userAuth(req,res,next){
    const token = "xxx";
  if(token =="xxx"){
    
    next()
  }else{
    res.status(401).send("Unathorized Request")
  }
}

module.exports={adminAuth,userAuth}