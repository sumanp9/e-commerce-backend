require('dotenv').config();

const stripe = require("stripe")('sk_test_51NvpBYI46CkulZFb9mZOoCIso4VMhIayhAZVLUMsmz1WEZRjCXITW6Up3UxY63OQFjw5yJpjgfZCHGylX8RfmPra00J5Jbsp0g');

/*
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
*/



exports.checkout = async(req, res, next) => {
  console.log(req.body)

  try{
    token = req.body.token;
    const customer = stripe.customers
      .create({
        email: req.body.email,
        source: token.id
      })
      .then((customer) => {
        console.log("Customer: "+ customer.id);
        return stripe.charges.create({
          amount: req.body.amount*100,
          description: 'Test Purchase',
          currency: "USD",
          customer:  customer.id
        });
      })
      .then ((charge) => {
        console.log("Charge"+ charge);
        res.json({
          data: "Success",
        });
      })
      .catch((err) => {
        res.json({
          data: "Failure",
        });
      });
      return true;
  } catch(error) {
    return false;
  }


}


