// address controller

import Address from "../model/address.model.js";
import User from "../model/user.model.js";

// add address

export const addAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, zipCode, userId } =
      req.body;

    const newAddress = new Address({
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
    });

    const savedAddress = await newAddress.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { address: savedAddress._id } },
      { new: true }
    );

    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get address by id
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update address
export const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete address
export const deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(
      deletedAddress.userId,
      { $push: { address: savedAddress._id } },
      { new: true }
    );
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get address by user id
export const getAddressByUserId = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
