const bcrypt = require('bcrypt')
const User = require('../models/user')
const cookie= require('cookie-parser')
module.exports = (req, res) => {
    const { email, password } = req.body 

    User.findOne({ email: email})
        .then((user) => {
            console.log(user)
            let cmp = bcrypt.compare(password, user.password)
            .then((match) => {
                if (match){             
                        req.session.userId = user._id ;
                        req.session.username = user.username ;
                          req.session.save(err => {
                            if (err) {
                            console.error("Session save error:", err);
                            return res.status(500).json({ success: false });
                         }})
                    return  res.json({ success: true });
                    }
                if (!match){return res.json({ success: false });}
            })
        }).catch((err) => {
            console.error(err);
            res.json({ success: false});
        });
}