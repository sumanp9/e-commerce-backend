const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_name: {
      type:DataTypes.STRING, 
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
        type:  DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billing_address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    role_type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  const Product = sequelize.define('Product', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING, 
        allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    details:{
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type:DataTypes.NUMERIC, 
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
  }, {
    timestamps: false
  })

  const ProductRating = sequelize.define('ProductRating',  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rating: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  },  {
    timestamps: false
  })

  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  },{
    timestamps: false
  }) 

  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  const Transaction = sequelize.define('Transaction',  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    charge_id: {
      type: DataTypes.STRING,
    },

    user: {
      type: DataTypes.STRING,
    },

    total: { 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    timestamps: false //to display when transaction happened
  })

  const TransactionDetails = sequelize.define('TransactionDetails',  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false

    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false

    },

    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    timestamps: false //to display when transaction happened
  })

  User.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'CASCADE' });
  Product.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE'});
  User.hasMany(Cart, {
    foreignKey: 'user_id',
    as: 'carts'
  })

  Cart.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete:'CASCADE'
  })

  Product.hasMany(Cart, {
    foreignKey: 'product_id',
    as: 'carts'
  })

  Product.hasMany(ProductRating, {
    foreignKey: 'product_id', 
    as: 'product_id'
  })

  User.hasMany(ProductRating, {
    foreignKey: 'user_id', 
    as: 'user_id'
  })

  Cart.belongsTo(Product, {
    foreignKey: 'product_id',
    onDelete:'CASCADE'
  })

  User.hasMany(Transaction,{
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  })

  TransactionDetails.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    onDelete: 'CASCADE'
  })

  Transaction.hasMany(TransactionDetails, {
    foreignKey: 'transaction_id',
    as: 'transactiondetails'
  })
  Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  })

  return {
    User,
    Role,
    Product,
    Category,
    Cart, 
    Transaction,
    TransactionDetails, 
    ProductRating
  };
};
