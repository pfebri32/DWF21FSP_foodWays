const Joi = require('joi');
const { Op } = require('sequelize');

const { User, Product } = require('../../models');

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product.
    const product = await Product.findOne({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
      where: {
        id,
      },
    });

    if (!product) {
      return res.send({
        status: 'invalid',
        message: "Product doesn't exist",
      });
    }

    res.send({
      status: 'success',
      message: 'Product does exist.',
      data: product,
    });
  } catch (err) {
    return res.send({
      status: 'failed',
      message: err,
    });
  }
};

// Require Auth and Auth Roles middleware.
exports.addProduct = async (req, res) => {
  try {
    const { body, user, files } = req;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      price: Joi.number().min(0).required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Create new product to database.
    const product = await Product.create({
      ...body,
      img: files.img[0].filename,
      userId: user.id,
    });

    // Get data product with relation to user.
    const productData = await Product.findOne({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      where: {
        id: product.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    res.send({
      status: 'success',
      message: 'Product has been added.',
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    // Get all products.
    const products = await Product.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      attributes: {
        exclude: ['userId'],
      },
    });

    res.send({
      status: 'success',
      message: 'Sueccessfully to get the products.',
      data: {
        products,
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

// :id as parameter.
exports.getProductsByPartnerId = async (req, res) => {
  try {
    const { id } = req.params;

    // Get all products by partnerId.
    const products = await Product.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['name', 'id'],
      },
      where: {
        userId: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
    });

    // Refactor data.
    let user = {};
    let datas = [];

    if (products.length > 0) {
      user.id = products[0].user.id;
      user.name = products[0].user.name;
      datas = products.map((product) => {
        const img = product.dataValues['img'];
        delete product.dataValues['user'];
        if (img) {
          product.dataValues['img'] = process.env.UPLOADS_URL + img;
        }
        return product;
      });
    } else {
      user = await User.findOne({
        where: {
          id,
          role: 'partner',
        },
        attributes: ['name'],
      });
    }

    // Validate user.
    if (!user) {
      return res.status(400).send({
        status: 'invalid',
        message: "This shop doesn't exist.",
      });
    }

    res.send({
      status: 'success',
      message: "Successfully to get the products by partner's id.",
      data: {
        user,
        products: datas,
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

// Require Auth and Upload middleware.
// :id as parameter.
exports.updateProduct = async (req, res) => {
  try {
    const { user, body, params, files } = req;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
      price: Joi.number().min(0).required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Validate owner of product and admin.
    const isOwner = product.userId !== user.id;
    const isAdmin = role === 'admin';

    if (isOwner && !isAdmin) {
      return res.status(403).send({
        status: 'forbidden',
        message: "You don't have right to access this.",
      });
    }

    // Update product.
    const product = await Product.update(
      {
        ...body,
      },
      {
        where: {
          [Op.and]: [{ id }, { userId: user.id }],
        },
      }
    );

    if (product.length < 1) {
      return res.send({
        status: 'invalid',
        message: 'Product has been failed to update.',
      });
    }

    res.send({
      status: 'success',
      message: 'Product has been successfuly updated.',
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};

// Require Auth Roles middleware.
// :id as parameter.
exports.deleteProduct = async (req, res) => {
  try {
    const { params, user, role } = req;
    const { id } = params;

    // Validate product.
    const product = await Product.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      return res.send({
        status: 'failed',
        message: "Product doesn't exist.",
      });
    }

    // Validate owner of product and admin.
    const isOwner = product.userId !== user.id;
    const isAdmin = role === 'admin';

    if (isOwner && !isAdmin) {
      return res.status(403).send({
        status: 'forbidden',
        message: "You don't have right to access this.",
      });
    }

    // Destory product.
    await Product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      message: 'Product has been deleted.',
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};
