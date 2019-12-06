var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var dotenv = require('dotenv');


dotenv.load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



// app.use(bodyParser.urlencoded({ extended: false }));
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');
// app.use('/public', express.static('public'));

// Load envirorment variables



// Connect to MongoDB

var Listing = require('./models/Listing');

console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


// Setup Express App
// var app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    Listing.find({}, function(err, listing) {
        console.log(listing);
        return res.render('home', {'listing': listing});
    });
    //res.render("home");
});

app.post('/listing', function(req, res) {
    // Create new movie
    var listing = new Listing({
        title: req.body.title,
        monthlyRent: parseInt(req.body.monthlyRent),
        rating: [],
        
        poster: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: parseInt(req.body.phoneNumber)
        },
        address: {
            streetName: req.body.streetName,
            city: req.body.city,
            state: req.body.state,
            zip: parseInt(req.body.zip)
        }
    });
    // Save movie to database
    listing.save(function(err) {
        if (err) throw err;
        res.redirect("/");
    });  

});

// Get all movies
app.get('/listingData', function(req, res){
    Listing.find({}, function(err, listings){
        if(err) throw err;
        res.send(listings);
    });
});

app.get('/description', function(req, res){
    res.render('description');
})

app.get('/listing', function(req, res) {
    // Get all movies
    res.render("add");
    // Listing.find({}, function(err, listings) {
    //     if (err) throw err;
    //     res.send(listings);
    // });
});

app.get('/listing/:id/review', function(req, res) {
    var send = '/listing/' + req.params.id + '/review';
    res.render("addReview", {"id": send});
});

app.post('/listing/:id/review', function(req, res){
    Listing.findOne({_id: req.params.id}, function(err, listingcheck){
        if (err) throw err;
        if(!listingcheck) return res.send("no listing found");
        
        listingcheck.rating.splice(listingcheck.rating.length, 0, {
            stars: req.body.stars,
            name: req.body.name,
            comment: req.body.comment, 
        });
        listingcheck.save(function(err) {
            if (err) throw err;
            res.redirect("/"+req.params.id+"/getReview");
        });  
        
    });
});

app.get('/:id/getReview', function(req, res){
    Listing.findOne({_id: req.params.id}, function(err, listingcheck){
        if (err) throw err;
        if(!listingcheck) return res.send("no listing found");
        
        var ret = listingcheck.rating;
        return res.render('reviews', {'reviews': ret});
    });
});

app.delete('/listing/:id/deleteid', function(req, res){ 
    Listing.findByIDAndRemove(req.params.id, function(err, listing){
        if(err) throw err;
        if (!listing) {
            return res.send('No Listing with that ID');
        }
        res.send('Movie deleted!');
    });
})

// Delete when rent is more than 1200
app.delete('/listing/deleteExpensive', function(req, res){ 
    Listing.deleteMany({"monthlyRent": {$gt: 1200}}, function(err){
        if(err) throw err;
        res.redirect('/');
    });
});


app.listen(3000, function() {
    console.log('App listening on port 3000!');
})