const mongoose = require("mongoose");

// ประกาศ Schema ก่อน
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

// แล้วค่อยสร้าง model
const Tasktoday = mongoose.model("Tasktoday", TasktodaySchema);

module.exports = Tasktoday;
