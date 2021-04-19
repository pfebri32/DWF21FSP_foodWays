const Joi = require('joi');
const { Sequelize, Op } = require('sequelize');
const { User, Order } = require('../../models');

exports.getUsers = async (req, res) => {
  try {
    // Get all users.
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'role'],
    });
    res.send({
      status: 'success',
      message: 'Successfully get all users.',
      data: {
        users,
      },
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};

// :id parameter.
exports.getUser = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    // Validate user.
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: ['name', 'role'],
    });

    if (!user) {
      return res.send({
        status: 'error',
        message: "User doesn't exist.",
      });
    }

    res.send({
      status: 'success',
      message: 'User does exist.',
      data: {
        user,
      },
    });
  } catch (error) {
    req.send({
      status: 'failed',
      message: error,
    });
  }
};

// :id parameter.
exports.deleteUser = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    // Delete user by id.
    await User.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: 'success',
      message: 'User has been deleted.',
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};

// Require Auth middleware.
exports.getSelf = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['name', 'phone', 'img', 'email'],
    });

    if (!user) {
      return res.send({
        status: 'invalid',
        message: "User doesn't exist.",
      });
    }

    res.send({
      status: 'success',
      message: 'User does exist.',
      data: {
        user,
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
exports.updateSelf = async (req, res) => {
  try {
    const { body, user } = req;
    const { id } = user;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(4).max(50),
      phone: Joi.string().min(8).max(13),
      // gender: Joi.any().valid('male', 'female'),
      loc_address: Joi.string(),
      loc_lat: Joi.number(),
      loc_lng: Joi.number(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details[0].message,
      });
    }

    // Validate user.
    const self = await User.findOne({
      where: {
        id,
      },
    });

    if (!self) {
      return res.send({
        status: 'failed',
        message: "User doesn't exist.",
      });
    }

    // Update user.
    await User.update(
      {
        ...body,
        img: req.files.img[0].filename,
      },
      {
        where: {
          id,
        },
        fields: ['name', 'phone', 'img', 'loc_address', 'loc_lng', 'loc_lat'],
      }
    );

    res.send({
      status: 'success',
      message: 'Your profile has been updated.',
      data: {
        img: process.env.UPLOADS_URL + req.files.img[0].filename,
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

// :id parameter.
exports.updateUser = async (req, res) => {
  try {
    const { body, user } = req;

    // Validate inputs.
    const schema = Joi.object({
      name: Joi.string().min(4).max(50),
      phone: Joi.string().min(8).max(13),
      img: Joi.string().max(255),
      gender: Joi.any().valid('male', 'female'),
      loc_address: Joi.string().max(255),
      loc_lat: Joi.number(),
      loc_lng: Joi.number(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: 'invalid',
        message: error.details[0].message,
      });
    }

    // Update user.
    await User.update(body, {
      where: {
        id: user.id,
      },
      fields: [
        'name',
        'phone',
        'gender',
        'img',
        'loc_address',
        'loc_lat',
        'loc_lng',
      ],
    });

    res.send({
      status: 'success',
      message: 'User has been updated.',
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.getMostPopularPartners = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    const users = await User.findAll({
      include: {
        model: Order,
        as: 'partner',
        attributes: [],
        where: {
          [Op.not]: {
            partnerId: 1,
          },
        },
      },
      attributes: [
        'id',
        'name',
        'role',
        'img',
        [
          Sequelize.fn('COUNT', Sequelize.col('partner.partnerId')),
          'countOrder',
        ],
      ],
      group: ['partner.partnerId'],
      order: [[Sequelize.col('countOrder'), 'DESC']],
      limit: limit ? limit : 100000,
      subQuery: false,
    });

    // Refactor.
    const datas = users.map((user) => {
      const img = user.dataValues['img'];
      if (img) {
        user.dataValues['img'] = process.env.UPLOADS_URL + img;
      }
      return user;
    });

    res.send({
      status: 'success',
      message: 'Get most popular users.',
      data: { users: datas },
    });
  } catch (error) {
    res.status(401).send({
      status: 'invalid',
      message: error,
    });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let ids = null;

    if (req.body.ids.length > 0) {
      ids = req.body.ids;
    }

    const options = {
      where: {
        role: 'partner',
        [Op.not]: [{ id: ids }],
      },
      limit: limit ? limit : 100000,
      attributes: ['id', 'name', 'img'],
    };

    const users = await User.findAll(options);

    // Refactor.
    const datas = users.map((user) => {
      const img = user.dataValues['img'];
      if (img) {
        user.dataValues['img'] = process.env.UPLOADS_URL + img;
      }
      return user;
    });

    res.send({
      status: 'success',
      message: 'Get partners is successful.',
      data: {
        users: datas,
      },
    });
  } catch (error) {
    res.status(401).send({
      status: 'invalid',
      message: error,
    });
  }
};
