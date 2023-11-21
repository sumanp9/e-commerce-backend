module.exports = app => {

    const controller = require("../controller/controller");
    const checkoutController = require("../controller/checkoutController"); 

    var router =  require("express").Router();

    router.post("/login", controller.findUser);

    router.get("/users", controller.findAllUsers);

    router.get("/categories", controller.findAllCategories);

    router.post("/category", controller.addCategory);

    router.get("/category", controller.findByCategory);

    router.post("/user", controller.createAccount);
    

    //router.put("/role", controller.updateRole);
    
    router.get("/products", controller.productList);

    router.post("/product", controller.addProduct);

    router.get("/product", controller.getProduct);
    
    router.put("/product", controller.updateProduct);

    router.delete("/product",  controller.deleteProduct);

    router.get("/cart", controller.getCart);

    router.post("/cart", controller.addToCart);

    router.get("/cartQuantity", controller.getCartQuantity);

    router.get("/cartDetails", controller.CartDetails);

    router.put("/increaseCartQty", controller.increaseCartQty);

    router.delete("/cartItem", controller.deleteCartItem);

    router.post("/checkout", checkoutController.checkout);

    router.put("/transaction", controller.updateInventory);//inventory

    router.get("/transactions", controller.getTransactions);//just transaction
    router.get("/transactionsDetails", controller.getTransactionDetails);

    
    app.use(router);
}