require('dotenv').config();

const stripe = require("stripe")('sk_test_51NvpBYI46CkulZFb9mZOoCIso4VMhIayhAZVLUMsmz1WEZRjCXITW6Up3UxY63OQFjw5yJpjgfZCHGylX8RfmPra00J5Jbsp0g');

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
        console.log("Charge"+ charge.id);
        res.json({
          data: "Success",
          charge_id: charge.id
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


