const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    status : {
        type : String,
        enum : ['booked', 'available'],
        default : 'available'
    }
})

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please provide movie name'],
        maxlength:50
    },
    price : {
        type : Number,
        default : 10
    },
    seats: [seatSchema]
},{timestamps:true})

module.exports = mongoose.model('Movie',movieSchema)