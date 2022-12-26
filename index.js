const express = require('express');
const path    = require('path');
const port    = 3000;

const app = express();


/* --------- Database ----------  */
const db      = require('./config/mongoose');
const Contact = require('./models/contact');

/* --------- End ----------  */


/* --------- Middlewares ----------  */
// Setting the view engine to ejs
app.set('view engine','ejs');

// Setting the view folder path 
app.set('views',path.join(__dirname,'views'));

// Parser- Works as a middle ware between the browser and server
app.use(express.urlencoded());

// Middleware to pick all the static files from the folder public
app.use(express.static('public'));

/* --------- End ----------  */


// Holds the static contact list (default list), later on we'll push stuff into this array (stored in RAM)
// and when we switch off the server, the array resets to the default elements
// Used without database
var contactList = [
    {
        name: "Mridul Verma",
        phone: "7009100026"
    },
    {
        name: "Chahat",
        phone: "6239412196"
    }
]

// Read- reading info from the home page or '/' route
app.get('/',function(req,res){
    /* ----- For when there was no database ----- */
    // Using ejs to pass values from server to the home page or '/' route
    // res.render('home',{
    //     title: "My contact list",
    //     contact_list: contactList
    // });

    /* ----- For when there is database ----- */
    // mongoose which finds items from the database
    // the first argument being empty means we fetch the entire collection
    // we can add conditions here too to 
    Contact.find({}, function(err,contacts){
        if(!err){
            res.render('home',{
                title: "My contact list",
                contact_list: contacts
            });
        }
    })
})

// Deletes a contact using a get request
// We are using 'query params' which look something like this
// localhost:3000/?phone=7009100026&name=Mridul%20Verma
// selecting the queries then as required
app.get('/delete-contact', function(req,res){
    /* ----- For when there was no database ----- */
    // const phone = req.query.phone;
    // let contactIndex = contactList.findIndex(contact => contact.phone==phone);
    
    // splice function is used to find the given index in the array and deletes the given index number
    // if(contactIndex!==-1){
    //     contactList.splice(contactIndex,1);
    // }

    /* ----- For when there is database ----- */
    // self explanatory
    const id = req.query.id;

    Contact.findByIdAndRemove(id,function(err){
        if(!err){
            return res.redirect('back');
        }
    })
})

// Create- creating info on the mentioned route and pushing into the array
app.post("/create-contact", function(req,res){
    /* ----- For when there was no database ----- */
    // contactList.push({
    //     name:req.body.name,
    //     phone:req.body.phone
    // })

    /* ----- For when there is database ----- */
    // Creates a new contact object using the schema 'Contact' and adds 
    // it into the database
    // Then using a callback function to return back to the original route
    Contact.create({
        name: req.body.name,
        phone: req.body.phone
    }, function(err, newContact){
        if(!err){
            console.log(newContact);
            return res.redirect("back");
        }   
    })
})

// Listening on port 3000
app.listen(port,function(err){
    if(!err){
        console.log("Server started!");
    }
})





/* -------------------- Misc --------------------- */


// Custom middleware1 (practise)
// app.use(function(req,res,next){
//     console.log('Middleware 1 called');
//     next();
// })

// // Custom middleware2 (practise)
// app.use(function(req,res,next){
//     console.log("Middleware 2 called");
//     next();
// })
