'use strict';

module.exports = (sequelize, DataTypes) => {
  var Picture = sequelize.define('Picture', {

    productId: DataTypes.INTEGER,

    url: DataTypes.STRING

  });

  return Picture;
};
