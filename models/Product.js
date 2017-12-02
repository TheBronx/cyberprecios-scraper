'use strict';

module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {

    ean: {
      type: DataTypes.STRING,
      //unique: true
    },

    pccomponentesId: {
      type: DataTypes.INTEGER,
      unique: true
    },

    category: DataTypes.STRING,

    title: DataTypes.STRING

  });

  Product.associate = function (models) {
    models.Product.hasMany(models.Price, {foreignKey: 'productId', sourceKey: 'id'});
  };

  return Product;
};
