
const { where, Transaction, Sequelize } = require("sequelize");
const db =  require("../models/index");
const eCommerceDB =  db.ecommerce;

const {hashPassword, comparePassword} = require('../util/encrypt');
const { compare, hash } = require("bcryptjs");
const ecommerce_model = require("../models/ecommerce_model");
const jwt = require('jsonwebtoken');
const { default: Decimal } = require("decimal.js");

const secretKey = process.env.SECRET_KEY || 'fallback-secret-key';

let ioInstance;

exports.setIoInstance = function (io){
    ioInstance = io;
  }


exports.findAllUsers = async (req, res) => {
console.log("params" + req.headers['authorization'])
const token = req.headers['authorization'].split(' ')[1];
    await eCommerceDB.User.findAll(
        {attributes: ['id','name']}
    )
        .then((users) => {
            return res.send(users);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({message: "internal server error"});
        })
};

exports.findUser = async(req, res) =>{

    try{
        if (!req.body.user_name) {
            return res.status(400).send({
            message: "Username can not be empty!"
            });      
        }

        const hashedPassword = await eCommerceDB.User.findOne({
            where: {user_name: req.body.user_name},
            attributes:['password']
        })
        
       const isValidPassword =  await comparePassword(req.body.password, hashedPassword.password);

       if(isValidPassword) {
        const person = await eCommerceDB.User.findOne({
            where: {user_name: req.body.user_name},
            attributes:['id', 'name', 'email', 'role_id']
        });
        
        if(!person) {
            return res.status(500).json({message: "User not found."});
        }

        
        const role = await eCommerceDB.Role.findOne({
            where: {id: person.role_id},
            attributes: ['role_type']
        });
        console.log("Role is: " + role.role_type)
        const token = jwt.sign({sub: person.id,
            role: role.role_type
         }, secretKey, {expiresIn: '1h'});

        //console.log(jwt.verify(token, secretKey).sub)
        const userData = {
            user:{
                id: person.id,
                name: person.name,
                email: person.email,
                role: role.role_type
            }
        };
        return res.send({userData, token})
       } else {
        res.status(401).json({ message: 'Authentication failed' });
       }

    }catch(err) {
            console.error(err);
            return res.status(500).json({message: "internal server error"});
        }
};

exports.findAllCategories = async (req, res) => {

    try{
        eCommerceDB.Category.findAll().then((categories) => {
            res.send(categories);
        })
    }
    catch(err){
            console.error(err);
            return res.status(500).json({message: "internal server error"});
        }

}

exports.addCategory = async(req, res) => {

    const category = {name: req.body.name};
    try{
        await eCommerceDB.Category.create(category);
        res.status(201).json({ message: 'Category created successfully' });

    }catch(err) {
        console.error(err);
        return res.status(500).json({message: "internal server error"});
    }
            
}

exports.findByCategory = async(req, res) => {

    const id = req.query.id;

    try{ 
        eCommerceDB.Product.findAll({where: {category_id: id}}).
            then((products) => {
                return res.send(products);
            })
    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "internal server error"});
    }

    
}


exports.createAccount = async (req, res) => {
    
    try{
        if (!req.body.name) {
            res.status(400).send({
            message: "Content can not be empty!"
            });
            return;
        }
        const hashedPassword =  await hashPassword(req.body.password);
        console.log(await hashPassword(req.body.password))

        console.log(req.body)

        const userData = {
            name: req.body.name,
            email: req.body.email,
            user_name: req.body.user_name,
            password: hashedPassword,
            phone_number: req.body.phone,
            billing_address: req.body.address,
            role_id: 2
        }
    
        await eCommerceDB.User.create(userData);

        res.status(201).json({ message: 'User created successfully' });

        
        
    } catch(error) {
        res.status(500).json({ error: 'An error occurred while creating the user.' });    
    }
};

exports.addProduct = async(req, res) =>{

    console.log(req.body)
    console.log("Add Product")

    try{

        const product = await eCommerceDB.Product.findOne({
            where: {name: req.body.name} 
        })

        if(product) {
            return res.status(409).json({ message: "Duplicate entry. The item you're trying to add already exists. "});
        }

        const ProductData = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            details: req.body.details,
            quantity: req.body.quantity,
            price: req.body.price,
            category_id: req.body.category_id
        }

        await eCommerceDB.Product.create(ProductData);
        res.status(201).json({ message: 'Product added successfully' });
    } catch(err) {
        console.log(err.message)
        res.status(500).json({ error: 'An error occurred while adding the product.' });    

    }
};

exports.updateProduct = async(req, res) => {

    try{
        const productData  = req.body;
       await  eCommerceDB.Product.update(productData, {
            where: {id: productData.id}
        })
        return res.status(201).json({ message: 'Product updated successfully' })
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred while updating the product.' });    
    }
}

exports.deleteProduct = async(req, res) => {
    const id = req.query.id;

    try{
        console.log(id)
        eCommerceDB.Product.destroy({
            where: {id: id}
        })
        return res.status(200).json({ message: 'Product deleted successfully' })

    } catch {
        return res.status(500).json({ error: 'An error occurred while deleting the product.' });    

    }
}

exports.productList = async(req, res) =>{
    try{
        await eCommerceDB.Product.findAll().
            then((products) => {
                res.send(products);
            })
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while fetching the product list.' });    
    }
};

exports.updateProduct = async(req, res) => {
    try{
        if (!req.body.id) {
            res.status(400).send({
            message: "Content can not be empty!"
            });
            return;
        }

        const ProductData = {
            id: req.body.id,
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            details: req.body.details,
            quantity: req.body.quantity,
            price: req.body.price
        }

        await eCommerceDB.Product.update(ProductData, {
            where: {
                id: ProductData.id
            }
        });

        res.status(200).json({message: "Product updated successfully!"});
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while updating the product.' }); 
    }
};

exports.getProduct = async(req,res) =>{

    try{
        if (!req.query.id) {
            res.status(400).send({
            message: "Content can not be empty!"
            });
            return;
        }
        const id = req.query.id;
        
        await eCommerceDB.Product.findByPk(id).
            then((product) => res.send(product));
    } catch(err) {
        console.error(err.message);
        return res.status(500).json({error: 'An error occured while fetching the product'});
    }
};

exports.getCart = async(req, res) => {

    try{
        if (!req.query.user_id) {
           return res.status(400).send({
            message: "Content can not be empty!"
            });
        }

        await eCommerceDB.Cart.findAll({
            where: {user_id: req.query.user_id}
        }).then((listOfCart) => {
            return res.send(listOfCart);
        })

    }catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'An error occured while fetching user cart'});
    }
};

exports.addToCart = async(req, res) => {

    const cartData = {
        user_id: req.body.user_id,
        product_id: req.body.product.id,
        quantity: req.body.product.quantity,
    }

    try{
        if (!req.body.user_id) {
            res.status(400).send({
            message: "Content can not be empty!"
            });
            return;
        }

        const product = await eCommerceDB.Cart.findOne(
            {where: {user_id: cartData.user_id , product_id: cartData.product_id }}
        )

        if(product) {
            cartData.quantity = product.quantity+cartData.quantity;
            await eCommerceDB.Cart.update(cartData, {
                where: {id: product.id}
            }).then(() => {
                return  res.status(201).json({ message: ' Added to cart successfully' });
             })

        } else(
            await eCommerceDB.Cart.create(cartData, {
                where: {user_id: cartData.user_id, product_id: cartData.user_id}
            }).then(() => {
               return  res.status(201).json({ message: ' Added to cart successfully' });
            })
        )

       
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({error: 'An error occured while adding to cart'});
    
    }
};

exports.getCartQuantity = async(req, res) => {

    try{
        const user_id = req.query.user_id;
        let totalQuantity = 0;
        const quantityList = await eCommerceDB.Cart.findAll({
            where: {user_id : user_id},
            attributes: ['quantity']
        })

        for (const cart of quantityList) {
        totalQuantity += cart.quantity;
        }
        console.log(totalQuantity);

        return res.send({totalQuantity})
    } catch(err) {
        console.error(err.message);
        return res.status(500).json({error: 'An error occured '});
    
    }
};

exports.CartDetails = async (req, res) => {
    
    try{
        if(!req.query.user_id) {
            return res.status(400).send({
                message: "Content can not be empty!"
                });
        } 
       

       const cartData = await eCommerceDB.Cart.findAll({
        where: {user_id: req.query.user_id},
        include: [
            {
              model: eCommerceDB.Product,
              attributes:['id','name', 'price', 'image'],
              required: true
            }
          ],
          attributes: ['id', 'quantity']
      })

      let grandTotal = 0;

      const formattedData =cartData.map(item => {
        const product = item.Product;
        const total = item.quantity* product.price;

        grandTotal+=total;

        return( {
            id: item.id,
            quantity: item.quantity,
            product: {
                id: product.id,
              name: product.name,
              price: product.price,
              image: product.image
            },
            total: Math.round((total + Number.EPSILON) * 100) / 100
          })
          
      })

      
      grandTotal = Math.round((grandTotal + Number.EPSILON) * 100) / 100

      return res.send({ data: formattedData, grandTotal: grandTotal })

    } catch(err) {
        console.error(err.message);
        return res.status(500).json({error: 'An error occured '});
    }
};

exports.increaseCartQty = async(req, res) => {


    console.log("In increase qty method")

    try{

        if(!req.body.id) {
            return res.status(400).send({
                message: "Content can not be empty!"
                });
        }

        const data = {
            id: req.body.id,
            product_id: req.body.product_id,
            increment: req.body.increment
        }

        const qty = await eCommerceDB.Cart.findOne({
            where: {id: data.id},
            attributes: ['quantity']
        })

        let incrementValue = data.increment? 1 : -1;

            await eCommerceDB.Cart.update(    
            {quantity: qty.quantity+ incrementValue},
            {where: {id : data.id, product_id: data.product_id}
        }).then((result => {
            console.log("Cart Value Updated ");
        }))
    
    } catch(err) {
        console.log(err);
        return res.status(500).send("internal server error")
    }
};

 exports.deleteCartItem = async(req, res) => {
    console.log("Deleting Item from Cart")
    try {

        await eCommerceDB.Cart.destroy({
          where: { id: req.query.id}
        });
        console.log('Item removed from the cart.');
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    };

exports.updateInventory = async(req, res) => {

    const data = req.body.cartData.data;
    console.log(req.body)
    const charge_id = req.body.charge_id;
    const name = req.body.name;
    const amount = req.body.cartData.grandTotal;
    const id = req.body.id

    try{
        const transactionData = {
            user_id: id,
            user: name,//userName, 
            total: amount,
            charge_id: charge_id   
        }

        console.log("Transaction Data: ", transactionData)
        const newTransaction = await eCommerceDB.Transaction.create(transactionData);
        const trans_id = newTransaction.id;
        await transactionDetails(trans_id, data);
            if(ioInstance){
                console.log("getting event");
                ioInstance.emit('test event',  transactionData);
            } else {
                console.error('Socket.IO instance not set. Make sure to call setIoInstance(io) before emitting values.');                
            }
        return res.status(201).json(newTransaction);

    }catch(error){
        console.error('Error', error)
         res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getTransactions = async (req, res) => {
    try{
        const transactionsList = await eCommerceDB.Transaction.findAll();

        return res.send(transactionsList)
    } catch(error) {
        console.error("Error", error);
    }
}

async function transactionDetails(id, data) {
    console.log("id is "+ id)
    let transactionList = [];
    try{
        for (const item of data) {

            const productQuantity = await eCommerceDB.Product.findOne({
                where: { id: item.product.id },
                attributes: ['quantity']
            });
            await eCommerceDB.Product.update(    
                {quantity:  productQuantity.quantity- item.quantity},
                {where: {id : item.product.id}
            });

            await eCommerceDB.Cart.destroy({
                where: {id: item.id}
            });

   

            const transactionDetails = {
                transaction_id: id,//check this one(needs to be saved 1st)
                product_name: item.product.name, 
                quantity: item.quantity,
                price: item.product.price
            }
            transactionList.push(transactionDetails);            
        }

        try{
            await eCommerceDB.TransactionDetails.bulkCreate(transactionList);
        } catch(error) {
            console.error('Error during bulk creation of transactions :', error);
        }
    } catch(error) {
        console.error('Error', error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getTransactionDetails = async (req, res) => {
    const id = req.query.transaction_id;
    console.log(id);
    try{
        const transactionsList = await eCommerceDB.TransactionDetails.findAll({
            where: {transaction_id: id}
        })

        console.log(transactionsList)

        return res.status(201).json(transactionsList);

    } catch{
        console.error('Error', error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.userRating = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const product_id = req.query.product_id;

        if (!user_id || !product_id) {
            return res.status(400).send({
                message: "Unable to find User or Product"
            });
        }

        const userRating = await ProductRating.findOne({
            where: { user_id, product_id }
        });

        if (userRating) {
            const productRating = {
                user_id,
                product_id,
                rating: userRating.rating
            };

            return res.status(200).send(productRating);
        }

        return res.status(404).send({
            message: "Cannot find rating for the specified user and product"
        });

    } catch (error) {
        console.error("Error rating the product:", error);
        return res.status(500).send({
            message: "Internal server error while fetching the rating"
        });
    }
}

exports.rateProduct = async(req, res) => {

    const productRating = {
        product_id: req.query.product_id,
        user_id: req.query.product_id,
        rating: req.body.rating
    }

    try{
        if(!productRating.product_id || !productRating.user_id) {
            res.status(400).send({
                message: "product id or user id cannot be empty"
            })

        await eCommerceDB.ProductRating.create(productRating)
        res.status(200).send({
            message: "ratings added"
        })
        }
    }catch(err) {
        res.status(500).send({
            message: "Internal sever error while rating the product"
        })
    }

}

exports.avgProductRating = async(req, res)=> {
    const product_id = req.query.product_id;
    try{
        if(!product_id) {
            res.status(400).send({
                message: "product cannot be empty"
        })
        }

        const ratingLst = await eCommerceDB.ProductRating.findAll({
            where: {product_id: product_id}
        });

        const totalRating = ratingLst.reduce((sum, rating) => sum+ rating.rating, 0);

        const averageRating = ratingLst.length>0? (totalRating/ratingLst.length).toFixed(1): 0

        return res.status(200).json({"average_rating": averageRating});
    }catch(erorr) {
        res.status(500).send({
            message: "Internal Server error while reteriving product rating"
        })
    }

}

//updateRating or update

