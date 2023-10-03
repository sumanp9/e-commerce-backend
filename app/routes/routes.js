module.exports = app => {

    const controller = require("../controller/controller");

    var router =  require("express").Router();

    router.post("/login", controller.findUser);

    router.get("/users", controller.findAllUsers);

    router.get("/categories", controller.findAllCategories);

    router.get("/category", controller.findByCategory);

    router.post("/user", controller.createAccount);
    

    //router.put("/role", controller.updateRole);
    
    router.get("/products", controller.productList);

    router.post("/product", controller.addProduct);

    router.get("/product", controller.getProduct);
    
    router.put("/product", controller.updateProduct);

    router.delete("/product",  controller.deleteProduct);

    //Cart Http methods go here

    app.use(router);
}