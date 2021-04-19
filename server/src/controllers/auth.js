const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../../models');

exports.register = async (req, res) => {
  try {
    const { body } = req;
    const { email, password } = body;

    // Validate input.
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(24).required(),
      name: Joi.string().min(4).max(50).required(),
      phone: Joi.string().min(8).max(14),
      gender: Joi.string().min(1).max(255),
      role: Joi.any().valid('user', 'partner'),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.status(422).send({
        status: 'invalid',
        message: error.details[0].message,
      });
    }

    // Validate user with a same email.
    const isEmailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      return res.status(422).send({
        status: 'failed',
        message: 'Email is already exist.',
      });
    }

    // Encrypt password.
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_STRENGTH)
    );

    // Create new user.
    const user = await User.create({
      ...body,
      password: hashedPassword,
    });
    const { name, role, phone, id } = user;

    // Create token.
    const token = Jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    // Refactor.
    const img = user.img ? process.env.UPLOADS_URL + user.img : '';

    return res.send({
      status: 'success',
      message: 'Register is success.',
      data: {
        user: {
          id,
          name,
          token,
          role,
          email,
          phone,
          img,
        },
      },
    });
  } catch (error) {
    return res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const { email, password } = body;

    // Validate input.
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(24).required(),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.status(422).send({
        status: 'invalid',
        message: error.details[0].message,
      });
    }

    // Validate user with a same email.
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).send({
        status: 'invalid',
        message: 'Your email and password are incorrect.',
      });
    }
    const { name, role, phone, id } = user;

    // Validate password.
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).send({
        status: 'invalid',
        message: 'Your email and password are incorrect.',
      });
    }

    // Create token.
    const token = Jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    // Refactor.
    const img = user.img ? process.env.UPLOADS_URL + user.img : '';

    res.send({
      status: 'success',
      message: 'Login is success.',
      data: {
        user: {
          id,
          name,
          email,
          token,
          role,
          phone,
          img,
        },
      },
    });
  } catch (error) {
    res.send({
      status: 'failed',
      message: error,
    });
  }
};

exports.validate = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['name', 'email', 'img', 'phone', 'role', 'id'],
    });

    if (!user) {
      return res.status(401).send({
        status: 'invalid',
        message: 'Your account is invalid.',
      });
    }

    // Refactor.
    const img = user.img ? process.env.UPLOADS_URL + user.img : '';

    res.send({
      status: 'success',
      message: 'Your account is valid.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          img,
        },
      },
    });
  } catch (error) {
    res.status(502).send({
      status: 'invalid',
    });
  }
};
