const sendToken = (user,statusCode,res)=>{

    //creating jwt token
    const token = user.getJwtToken();

    //setting cookies
    const options = {
        expire: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 20 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statusCode).cookie('token', token ,options).json({
        success: true,
        user,
        token,
        message: "User registered successfully"
    })
}

module.exports = sendToken;