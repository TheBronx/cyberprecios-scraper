'use strict';

module.exports = (sequelize, DataTypes) => {
  var Price = sequelize.define('Price', {

    productId: DataTypes.INTEGER,

    price: {
      type: DataTypes.DECIMAL
    },

    stock: DataTypes.BOOLEAN

  });

  return Price;
};
