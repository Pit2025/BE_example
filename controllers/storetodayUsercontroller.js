const Tasktoday =require('../models/Taskuser')


module.exports = async (req, res) => {
    const FromCookie = req.cookies.userId;
    const tasks = req.body.tasks;
    
  await Tasktoday.findOneAndUpdate(
  { userId: FromCookie },
  { tasks: tasks },
  { upsert: true, new: true } // ถ้าไม่มี document ให้สร้างใหม่
).then(()=>{ 
        console.log('user savetask')
        res.json({ success: true });
    }).catch((error) => {
        console.log(error)
        return  res.json({ success: false });   
    }) 
}


