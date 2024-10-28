const User = require('../model/User')

const handleLogout = async (req,res)=>{
    //On client also delete the accessToken

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204); //No Content to send back
   
    const refreshToken = cookies.jwt
    //check for duplicate user name in the database
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None'});

        return res.sendStaus(204);
    }
    
    //Delete the refresh token in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result);
    
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None'})
    res.sendStatus(204);
   
}

module.exports = {handleLogout};