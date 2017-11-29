'use strict';

module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    created: DataTypes.DATE
  });

  return Product;
};
