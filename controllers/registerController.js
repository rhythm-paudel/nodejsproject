
const User = require('../model/User');



//install bcrypt to hash and store password
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    const {user,pwd} = req.body
    if(!user || !pwd) return res.status(400).json({"message":"Username and Password are required"});
    //check for duplicate user name in the database
    const duplicate = await User.findOne({username:user}).exec();
    if(duplicate) return res.sendStatus(409); //409 is for conflict error
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd,10);
        //CREATE AND store the new user
        const result = await User.create({
            'username':user,
            'password': hashedPwd})
        // const newUser = newUser()  {alternate way of doing}
        // const result = await newUser.save()
            console.log(result)
        res.status(201).json({'success':`New User ${user} created`});
    }catch(err){
        res.status(500).json({'message':err.message})
    }
}

module.exports = {handleNewUser}