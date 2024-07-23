require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

const getStripeCustomerByEmail = async (email) => {
    const customers = await stripe.customers.list({ email })
    return customers.data[0]
}
  
const createStripeCustomer = async (input) => {
    const customer = await getStripeCustomerByEmail(input.email)
    if (customer) return customer
  
    const createdCustomer = await stripe.customers.create({
      email: input.email,
      name: input.name,
    })

    return createdCustomer
}

app.post('/checkout', async (req, res) => {
    let { email, name, items, success_url, cancel_url } = req.body;

    if (!req.body.hasOwnProperty('success_url')) {
        success_url = `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`;
    }

    if (!req.body.hasOwnProperty('cancel_url')) {
        cancel_url = `${process.env.BASE_URL}/cancel`;
    }

    if (!req.body.hasOwnProperty('items')) {
        items = [
            {
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: "Passagem Ida e Volta Adulto"
                    },
                    unit_amount: 6500
                },
                quantity: 3
            },
            {
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: "Passagem Ida e Volta Criança 4-10 anos"
                    },
                    unit_amount: 4000
                },
                quantity: 2
            }
        ]
    }
    
    const customer = await createStripeCustomer({
        email: email,
        name: name
    });
    
    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: items,
        mode: 'payment',
        shipping_address_collection: {
            allowed_countries: ['BR']
        },
        success_url: success_url,
        cancel_url: cancel_url
    })

    if (req.body.hasOwnProperty('items')) {
        res.send({url: session.url})
    } else {
        res.redirect(session.url)
    }
})

app.get('/complete', async (req, res) => {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])

    res.send('Your payment was successful <br><br>' + JSON.stringify(result))
})

app.get('/cancel', (req, res) => {
    res.redirect('/')
})

app.listen(3005, () => console.log('Server started on port 3005'))
