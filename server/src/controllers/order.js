const Joi = require('joi');
const { Op } = require('sequelize');

const { Order, Product, OrderProduct, User } = require('../../models');

// :id as parameter.
exports.getOrdersByPartnerId = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    // Get all orders from partner.
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
            attributes: [],
          },
          attributes: ['name'],
        },
        {
          model: User,
          as: 'customer',
          attributes: ['name'],
        },
      ],
      attributes: ['id', 'status'],
      where: {
        partnerId: id,
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (err) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

// Require Auth middleware.
exports.getMyOrders = async (req, res) => {
  try {
    const { user } = req;

    // Get all orders from customer.
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
          attributes: ['name', 'price'],
        },
        {
          model: User,
          as: 'partner',
          attributes: ['name'],
        },
      ],
      where: {
        customerId: user.id,
      },
      attributes: ['id', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const ordersData = orders.map((order) => {
      const products = order.dataValues.products.map((product) => {
        product.dataValues.quantity =
          product.dataValues.orderProduct.dataValues.quantity;
        delete product.dataValues.orderProduct;
        return product;
      });
      order.dataValues.products = products;
      return order;
    });

    res.send({
      status: 'success',
      data: {
        orders: ordersData,
      },
    });
  } catch (error) {
    res.send({
      status: 'invalid',
      message: error,
    });
  }
};

// Require Auth middleware.
// :id as parameter.
exports.getOrdersByCustomerId = async (req, res) => {
  try {
    const { user } = req;

    // Get all orders from customer.
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
        },
        {
          model: User,
          as: 'customer',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'partner',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
      where: {
        customerId: user.id,
      },
    });

    res.send({
      status: 'success',
      data: {
        orders,
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

// Require Auth middleware.
// :id as parameter.
exports.getOrderById = async (req, res) => {
  try {
    const { params, user } = req;
    const { id } = params;

    const order = await Order.findOne({
      include: [
        {
          model: Product,
          as: 'products',
          through: {
            model: OrderProduct,
            as: 'orderProduct',
          },
          attributes: ['id', 'name', 'price', 'img'],
        },
        {
          model: User,
          as: 'partner',
          attributes: ['name'],
        },
      ],
      where: {
        id,
      },
      attributes: [
        'status',
        'customerId',
        'partnerId',
        'loc_address',
        'loc_lng',
        'loc_lat',
      ],
    });

    // Validate user.
    if (!(order.customerId === user.id || order.partnerId === user.id)) {
      return res.status(402).send({
        status: 'invalid',
        message: 'Access denied.',
      });
    }

    // Refactor.
    const products = order.products.map((product) => {
      product.dataValues.quantity =
        product.dataValues.orderProduct.dataValues.quantity;
      product.dataValues['img'] =
        process.env.UPLOADS_URL + product.dataValues['img'];
      delete product.dataValues.orderProduct;
      return product;
    });
    order.products = products;
    delete order.dataValues.customerId;
    delete order.dataValues.partnerId;

    res.send({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      products: Joi.array().items(
        Joi.object({
          id: Joi.number().required(),
          quantity: Joi.number().min(0).required(),
        })
      ),
      loc_address: Joi.string(),
      loc_lng: Joi.number(),
      loc_lat: Joi.number(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Validate all products.
    let productsId = [];
    for (let i = 0; i < body.products.length; i++) {
      productsId.push(body.products[i].id);
    }

    const products = await Product.findAll({
      where: {
        id: {
          [Op.or]: productsId,
        },
      },
    });

    if (products.length < 1 || products.length !== body.products.length) {
      return res.send({
        status: 'invalid',
        message: "Some from your product doesn't exist.",
      });
    }

    // Validate products to keep it from a same place.
    const partnerId = products[0].userId;
    for (let i = 1; i < products.length; i++) {
      if (partnerId !== products[i].userId) {
        return res.send({
          status: 'invalid',
          message: 'Customer can an order of the menu from a same place.',
        });
      }
    }

    // Create order.
    const order = await Order.create({
      status: 'approval',
      loc_address: body.loc_address,
      loc_lng: body.loc_lng,
      loc_lat: body.loc_lat,
      customerId: user.id,
      partnerId: partnerId,
    });

    // Create bulk array for order product.
    let bulk = [];
    for (let i = 0; i < products.length; i++) {
      bulk.push({
        quantity: body.products[i].quantity,
        productId: body.products[i].id,
        orderId: order.id,
      });
    }

    await OrderProduct.bulkCreate(bulk);

    // Get user who order.
    const customer = await User.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: user.id,
      },
    });

    // Get data to send.
    const orderData = await Order.findOne({
      include: {
        model: Product,
        as: 'products',
        through: {
          model: OrderProduct,
          as: 'orderProduct',
        },
      },
      where: {
        id: order.id,
      },
    });

    res.send({
      status: 'success',
      message: 'Your order is success.',
      data: {
        transaction: {
          id: order.id,
          userOrder: customer,
          order: orderData,
        },
      },
    });
  } catch (err) {
    res.send({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { body, params } = req;
    const { status } = body;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      status: Joi.string().min(1).max(255),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details.message[0],
      });
    }

    // Update status order.
    await Order.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    );

    res.send({
      status: 'success',
      message: 'Your order has been updated.',
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { params, user } = req;
    const { id } = params;

    const order = await Order.findOne({
      where: {
        id,
      },
    });

    if (order.partnerId !== parseInt(user.id)) {
      return res.send({
        status: 'Access Denied',
        message: "You don't have right to access.",
      });
    }

    await Order.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      message: 'Your order has been deleted.',
      data: {
        id,
      },
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};
