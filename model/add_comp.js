const { text } = require("body-parser");
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    caseIdInput: { type: Number, unique: true },
    Complainer_same_as_victim: {
      type: Boolean,
      unique: false,default:false
    },

    complainer_details: {
      date_of_case_registered: { type: Date, unique: false },
      date_of_complainer_visit: { type: Date, unique: false },
      name_of_complainer: { type: String, unique: false },
      aadhar_card_number: { type: Number, unique: false },
      complainer_mobile_number: { type: Number, unique: false },
      complainer_alternative_number: {
        type: Number,
        unique: false
      },
      complainer_email_address: { type: String, unique: false },
      complainer_alternative_email_address: {
        type: String,
        unique: false
      },
      curent_address_of_complainer: {
        type: String,
        unique: false
      },
      dob_of_complainer: { type: Date, unique: false },
      relationship_between_victim: {
        type: String,
        unique: false
      },
      victim_name: { type: String, unique: false },
    },

    complaint_details: {
      complaint_category: { type: String, unique: false },
      complaint_description: { type: String, unique: false },
      complaint_priority: { type: String, unique: false },
      date_and_time_of_incident: { type: Date, unique: false },
    },
    
    closed: {
      type: Boolean,
      default: false,
    },
  
    processes: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        text: String,
        assignTeam: String,
        status:{type:String, default:"pending"},
      },
    ]
  },
  
  { collection: "currentComplain" }
);

const complaint = mongoose.model("complaintSchema", complaintSchema);
module.exports = complaint;
