const User =require('../models/user')


module.exports = async (req, res) => {
    try {
    await newUser.save();
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }
        // error อื่น ๆ
    }

    User.create(req.body).then(()=>{ 
        console.log('user register successfully')
        res.json({ success: true });
    }).catch((error) => {
        console.log(error)
        if (error && error){
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            
        }
        return  res.json({ success: false });   
    }) 
    
    
}


