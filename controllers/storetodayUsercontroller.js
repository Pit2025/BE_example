const Tasktoday =require('../models/Taskuser')


module.exports = async (req, res) => {
  if (req.session.userId === undefined ){
    console.log('ไม่ได้login')
  return 
  }
  await Tasktoday.findOneAndUpdate(
  { userId: req.session.userId },
  { tasks: req.body.tasks },
  { upsert: true, new: true } // ถ้าไม่มี document ให้สร้างใหม่
).then(()=>{ 
        console.log('user savetask')
        res.json({ success: true });
    }).catch((error) => {
        console.log(error)
        return  res.json({ success: false });   
    }) 
}


