const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

// secret key: sk_test_WnIstwA8uDXtwfdv3Se4vaNL
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(`${__dirname}/public`))

//Index route
app.get('/', (req, res) => {
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
});

//Charge route
app.post('/charge', (req, res) => {
    const amount = 2500;
    // Create a new customer and then a new charge for that customer:
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount:amount,
        description: 'web development ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'))
});


const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`server starts on ${port}`)
})