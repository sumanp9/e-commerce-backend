
const { where } = require("sequelize");
const db =  require("../models/index");
const eCommerceDB =  db.ecommerce;

const {hashPassword, comparePassword} = require('../util/encrypt');
const { compare, hash } = require("bcryptjs");



exports.findAllUsers = (req, res) => {
    eCommerceDB.User.findAll(
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

    console.log("in findUsder", req.body)
    try{
        if (!req.body.user_name) {
            return res.status(400).send({
            message: "Content can not be empty!"
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

        const userData = {
            user:{
                id: person.id,
                name: person.name,
                email: person.email,
                role: role.role_type
            }
        };
        return res.send(userData)
       } else {
        console.log('invalid password')
       }

    }catch(err) {
            console.error(err);
            return res.status(500).json({message: "internal server error"});
        }
}

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

        const userData = {
            name: req.body.name,
            email: req.body.email,
            user_name: req.body.user_name,
            password: hashedPassword,
            phone_number: req.body.phone,
            billing_address: req.body.billing_address,
            role_id: 2
        }
    
        const User = await eCommerceDB.User.create(userData);

        res.status(201).json({ message: 'User created successfully' });

        
        
    } catch(error) {
        res.status(500).json({ error: 'An error occurred while creating the user.' });    
    }
};

exports.addProduct = async(req, res) =>{

    console.log(req.body)
    console.log("Add Product")

    try{
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
       await  eCommerceDB.Product.udpate(productData, {
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
    } catch(error) {
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
        const id = req.query.id
        
        await eCommerceDB.Product.findByPk(id).
            then((product) => res.send(product));
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'An error occured while fetching the product'});
    }
};




