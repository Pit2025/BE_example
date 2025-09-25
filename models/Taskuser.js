const mongoose = require("mongoose");

const TasktodaySchema = new mongoose.Schema({
  userId: String,
  tasks: [
    {
       id: mongoose.Schema.Types.Mixed,
      text: String,
      done: Boolean,
    },
  ],
});

const Tasktoday = mongoose.model("Tasktoday", TasktodaySchema);
module.exports = Tasktoday;
