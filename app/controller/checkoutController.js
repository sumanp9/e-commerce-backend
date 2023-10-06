require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Decimal = require('decimal.js');

exports.checkout = async (req, res, next) => {
    try {        
        const session = await stripe.checkout.sessions.create({
            shipping_address_collection
            : {
                allowed_countries
            : ['US', 'CA'],
              },
              shipping_options
            : [
                {
                  shipping_rate_data
            : {
                    type
            : 'fixed_amount',
                    fixed_amount
            : {
                      amount
            : 0,
                      currency
            : 'usd',
                    },
                    display_name
            : 'Free shipping',
                    delivery_estimate
            : {
                      minimum
            : {
                        unit
            : 'business_day',
                        value
            : 5,
                      },
                      maximum
            : {
                        unit
            : 'business_day',
                        value
            : 7,
                      },
                    },
                  },
                },
                {
                  shipping_rate_data
            : {
                    type
            : 'fixed_amount',
                    fixed_amount
            : {
                      amount
            : 1500,
                      currency
            : 'usd',
                    },
                    display_name
            : 'Next day air',
                    delivery_estimate
            : {
                      minimum
            : {
                        unit
            : 'business_day',
                        value
            : 1,
                      },
                      maximum
            : {
                        unit
            : 'business_day',
                        value
            : 1,
                      },
                    },
                  },
                },
              ],
            line_items: req.body.cart.data.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name,
                        images: [item.product.image]
                    },
                    unit_amount: new Decimal(item.product.price).times(100).toNumber()
                    },
                    
                quantity: item.quantity,
            })),
            
            mode: "payment",
            success_url: "http://localhost:8080/success.html",
            cancel_url: "http://localhost:8080/cancel.html"
        });
        res.set('Content-Security-Policy', "script-src 'self' https://js.stripe.com");
    
        getPaymentDetails(session.id)
        .then((data) => {
           // console.log('Payment intent details:', data);
        })
        .catch((error) => {
          console.error('Error fetching payment details:', error);
        });

        const payments = await stripe.paymentIntents.retrieve('pi_3Ny4UqI46CkulZFb1gBnkpa9');
        console.log("Customer details: "+ JSON.stringify(payments))

        return res.status(200).json(session.id);
    } catch (error) {
        next(error);
    }
};


async function getPaymentDetails(sessionId) {
    try{
        const payamentIntent = await stripe.checkout.sessions.retrieve(sessionId);
        return payamentIntent;
    } catch(error) {
        console.error('Error fetching payment details: ', error);
        throw error;
    }
}

