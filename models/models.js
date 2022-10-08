const mongoose = require("mongoose");
const yup = require("yup");

const admins = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    minlength:8,
    required: true,
  },
});

const validateAdmin = (admins) => {
  const schema = yup.object().shape({
    id: yup
      .string()
      .email()
      .required()
,
    password: yup.string().required().minlength(8, "password should be more than 8"),
  });

  return schema
    .validate(admins)
    .then((admins) => admins)
    .catch((err) => console.log(err));
};

exports.admins = new mongoose.model("admins", admins);
exports.validateAdmin = validateAdmin;
