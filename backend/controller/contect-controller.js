const Contact = require("../model/contect-model");

const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contactData = await Contact.create({ name, email, message });
    return res
      .status(200)
      .json({ message: "Message sent successfully", contactData });
  } catch (error) {
    res.status(200).json({ message: "not" });
  }
};
module.exports = contactForm;
