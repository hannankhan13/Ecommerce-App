import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {

      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone No. is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }


    // check user
    const existingUser = await userModel.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send({
      success: false,
      message: "Invalid email or password",
    });
  }

  // check user
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Email is not registered",
    });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(200).send({
      success: false,
      message: "Invalid password",
    });
  }

  // token
  const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).send({
    success: true,
    message: "Login successfully",
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    },
    token,
  });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({
        message: "Email is required"
      });
    }

    if (!answer) {
      res.status(400).send({
        message: "Answer is required"
      });
    }

    if (!newPassword) {
      res.status(400).send({
        message: "New password is required"
      });
    }
    // check

    const user = await userModel.findOne({
      email,
      answer
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer"
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {
      password: hashed
    });

    res.status(200).send({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    });
  }
};

// test controller
export const testController = (req, res) => {
  // console.log("protected route");
  res.send("protected route");
};

// update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true },
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};
