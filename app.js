const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");

const bodyParser = require("body-parser");
const stripe= require('stripe')(process.env.STRIPE_API_KEY);
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);

const authRoutes = require("./routes/authRoutes");
const { isAuth, isNotAuth } = require("./middleware/authMiddleware");
const {User} = require("./models/User")
const dbURI =
  "mongodb+srv://admin-vinit:vinsan@cluster0.4zgtg.mongodb.net/StripeApp?retryWrites=true&w=majority";

const endpointSecret = "whsec_719b87f29756f675dbfad9962723d42418799fd4ad874392c2a0bcb687ceced2";
//mongoose connect
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose connected");

    appsetup();
  })
  .catch((err) => console.log("dberror vro:", err));


var map = new Map();
map.set("price_1Lb7aUSBgcwoSERnH1pKoKnN",["Mobile","₹ 1000 per year"])
map.set("price_1Lb7ajSBgcwoSERn8f49Mzob",["Mobile","₹ 2000 per year"])
map.set("price_1Lb7b8SBgcwoSERn4pWGjDNZ",["Mobile","₹ 5000 per year"])
map.set("price_1Lb7bSSBgcwoSERnzf5e5edF",["Mobile","₹ 7000 per year"])
map.set("price_1Lb7Y7SBgcwoSERnk3PN9T0a",["Mobile","₹ 100 per month"])
map.set("price_1Lb7YuSBgcwoSERn9DhnzF9F",["Mobile","₹ 200 per month"])
map.set("price_1Lb7Z9SBgcwoSERneAsyhdTp",["Mobile","₹ 500 per month"])
map.set("price_1Lb7ZlSBgcwoSERnHIICO7Xl",["Mobile","₹ 700 per month"])



const appsetup = () => {
    const app = express();
  
    const port = 3000;
    // bind and listen the connections on the specified host and port.
    app.listen(process.env.PORT || 3000, function () {
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
  
    //middleware
    app.use(express.json());
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: false }));
  
    //views
    app.set("view engine", "ejs");


    //sessions
    const store = new MongoDBStore({ uri: dbURI, collection: 'sessions' })
    app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));
    let useremail;
    //middleware for storing session variables in res.locals which can be accessed by all pages
    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.session.isLoggedIn;
        res.locals.user = req.session.user;
        if (req.session.user){
          res.locals.username = req.session.user.name;
          useremail=req.session.user.email;
        }
        
        else
        res.locals.username = null
        next();
    })



    app.get("/",(req,res)=>{
        // console.log(req.session.user.plan);
        res.render("plans");
    })
    app.get("/myplan",(req,res)=>{
      // console.log(req.session.user.plan);
      res.render("myplan");
   })
    app.use(authRoutes);


    app.post("/create-checkout-session",isAuth,async (req,res)=>{
        const price_id = req.body.priceid;
        try{
            
              const session = await stripe.checkout.sessions.create({
                // billing_address_collection: 'auto',
                line_items: [
                  {
                    price: price_id,
                    // For metered billing, do not pass quantity
                    quantity: 1,
            
                  },
                ],
                mode:'subscription',
                success_url:`${process.env.SERVER_URL}/success.html`,
                cancel_url:`${process.env.SERVER_URL}/cancel.html`,
            })
            res.redirect(session.url)
        }catch(e){
            res.status(500).json({error:e.message})
        }
        
    })

    app.post('/webhook', bodyParser.json(),async (request, response) => {
        let event = request.body;
        
        switch (event.type) {
          case 'customer.subscription.updated':
            const priceid = event.data.object.plan.id;
            console.log(priceid);
            const newplan = {name:map.get(priceid)[0],price:map.get(priceid)[1],status:"active"};
            let updatedUser = await User.updateOne({email:useremail},{plan:newplan});
           
            break;
        }
  
        response.sendStatus(200);
      });
};  


