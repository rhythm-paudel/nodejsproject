const User = require('../model/User')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const handleLogin = async(req,res)=>{
    const {user,pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and Password are required"});
    //check for duplicate user name in the database
    const foundUser = await User.findOne({username:user}).exec();
    if(!foundUser){
        return res.sendStatus(401); //unauthorized code
    }
    //evaluate password 
    const match = await bcrypt.compare(pwd,foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        //This is where JWT will be created further
        const accessToken = jwt.sign(
            {"UserInfo":
                {
                    "username":foundUser.username,
                    "roles":roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        //saving refreshtoken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save()

        console.log(result);
        
        res.cookie('jwt',refreshToken,{httpOnly: true,sameSite:'None', maxAge: 24 * 60 * 60* 1000})
        res.json({accessToken})
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};