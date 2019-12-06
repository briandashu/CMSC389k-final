var mongoose = require('mongoose');
mongoose.Promise=global.Promise;

var reviewSchema = new mongoose.Schema({});

var reviewSchema = new mongoose.Schema({
    stars: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
});

var posterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        
    },
    lastName: {
        type: String,
        required: true,
        
    },
    phoneNumber: {
        type: Number,
        required: true,
        min: 0,
        max: 9999999999,
        
    }
});

var addressSchema = new mongoose.Schema({
    streetName: {
        type: String,
        required: true,
       
    },
    city: {
        type: String,
        required: true,
        
    },
    state: {
        type: String,
        required: true,
        
    },
    zip: {
        type: Number,
        required: true,
        min:0,
        max:99999,
    }

    
});

var listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        
    },
    monthlyRent: {
        type: Number,
        min: 0,
        max: 99999999999,
        required: true,
        
    },
    rating: [reviewSchema],
    
    poster: posterSchema,
    address: addressSchema,

  
    


});

var Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;