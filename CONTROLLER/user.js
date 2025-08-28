const User = require("../model/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async(req,res)=>{
    try{
  let {username , email , password} = req.body;
  const newUser = new User({email,username});
  const registeredUser = await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser ,(err)=>{
    if(err){
        next(err);
    }
    req.flash("Succes" ,"Welcome to Wanderlust");
    res.redirect("/listings");
  })
    }
    catch(e){
        req.flash("error" ,e.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login =  async(req ,res) =>{
        req.flash("Succes" ,"Welcome back to wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
        return;
    }

module.exports.logout = (req,res,next) =>{
    req.logout ((err)=>{
        if(err){
            next(err);
        }
        req.flash("Succes" ,"You are logged out!");
        res.redirect("/listings");
    });
}