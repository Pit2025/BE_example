const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new schema({
    email:{
        type: String,
        required: true,
        unique: true, // username ต้องไม่ซ้ำ
        trim: true
        //required: [true , 'pls write it']
    },
    password: {
        type: String,
        required: true,
        unique: false, // username ต้องไม่ซ้ำ
        trim: true
    }, 
    username: {
    type: String,
    required: true,
    unique: true, // username ต้องไม่ซ้ำ
    trim: true
  }});
   /* passwordHash: { type: String, required: true },
    // เก็บ refresh token ล่าสุด (ถ้าต้องการล็อกเอาท์จากทุกเครื่องก็ล้างค่านี้)
    refreshToken: { type: String, default: null }
  },{timestamps: true}
);*/

const TaskSchema = new mongoose.Schema({
    day:{
        type: String,
        required: false,
        unique: false, 
        trim: true
        //required: [true , 'pls write it']
    },
    day:{
        type: String,
        required: false,
        unique: false, 
        trim: true
        //required: [true , 'pls write it']
    },
    time: {
        type: String,
        required: false,
        unique: false, 
        trim: true
    },tag:{
        type: String,
        required: false,
        unique: false, 
        trim: true
    },activity:{
        type: String,
        required: false,
        unique: false, 
        trim: true
    },data:{
        type: String,
        required: false,
        unique: false, 
        trim: true
    }, 
    color: {
        type: String,
        required: false,
        unique: false, 
        trim: true
  },
  done: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // เชื่อมกับ user
});

const TasktodaySchema = new mongoose.Schema({
  userId: String,
  tasks: [
    {
      id: Number,
      text: String,
      done: Boolean,
    },
  ],
});

UserSchema.pre('save', function(next){
    const user =this
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(errorerror => {
            console.log('Error hashing password:', error)
            next(error) 
    })})

//const Task = mongoose.model('Tasktoday', TasktodaySchema);
//const Task = mongoose.model('Task', TaskSchema);
const User = mongoose.model('User',UserSchema)
module.exports = User 