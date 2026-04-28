const bcrypt = require('bcryptjs');
const UserModel = require('../model/user');

exports.create = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Email and password cannot be empty!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      email: req.body.email,
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      phone: req.body.phone || '',
      password: hashedPassword,
    });

    const data = await user.save();
    res.send({ message: 'User created successfully!!', user: data });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while creating user' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty!' });
  }

  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const data = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
      select: '-password',
    });

    if (!data) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.send({ message: 'User updated successfully.', user: data });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const data = await UserModel.findByIdAndRemove(req.params.id);
    if (!data) {
      return res.status(404).send({ message: 'User not found.' });
    }
    res.send({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password cannot be empty!' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
