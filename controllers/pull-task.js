const Tasktoday =require('../models/Taskuser')

module.exports = async (req, res) => {
  try{
    const userid = req.session.userId;
    const userDoc = await  Tasktoday.findOne({ userId: userid})
    if(userDoc){
      console.log(userDoc.tasks  )
      return res.json({ tasks: userDoc.tasks || [] }); 
    }
    if (!userDoc) {
      return res.json({ tasks: [] });
    }
  }catch(error){ 
    console.error("Error in user-pull-task:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

