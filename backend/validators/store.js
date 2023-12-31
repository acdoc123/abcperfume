const { check } = require("express-validator");
const Commission = require("../models/commission");

const createStore = () => [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Store name is required")
    .isLength({ max: 100 })
    .withMessage("Store name can contain up to 100 characters")
    .matches(
      /^(?=.*[a-zA-Z])[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/
    )
    .withMessage(
      "Store name must contain at least one letter (can contain numbers, some special characters such as _, ', - and space)"
    )
    .custom(checkStoreName),

  check("bio")
    .not()
    .isEmpty()
    .withMessage("Store bio is required")
    .isLength({ max: 3000 })
    .withMessage("Store bio can contain up to 3000 characters"),

  check("commissionId")
    .not()
    .isEmpty()
    .withMessage("CommissionId is required")
    .custom(checkCommission),
];

const updateStore = () => [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Store name is required")
    .isLength({ max: 100 })
    .withMessage("Store name can contain up to 100 characters")
    .matches(
      /^(?=.*[a-zA-Z])[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/
    )
    .withMessage(
      "Store name must contain at least one letter (can contain numbers, some special characters such as _, ', - and space)"
    )
    .custom(checkStoreName),

  check("bio")
    .not()
    .isEmpty()
    .withMessage("Store bio is required")
    .isLength({ max: 3000 })
    .withMessage("Store bio can contain up to 3000 characters"),
];

const activeStore = () => [
  check("isActive")
    .not()
    .isEmpty()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive type is boolean"),
];

const updateCommission = () => [
  check("commissionId")
    .not()
    .isEmpty()
    .withMessage("commissionId is required")
    .custom(checkCommission),
];

const openStore = () => [
  check("isOpen")
    .not()
    .isEmpty()
    .withMessage("isOpen is required")
    .isBoolean()
    .withMessage("isOpen type is boolean"),
];

//custom validator
const checkStoreName = (val) => {
  const regexes = [/abc[^\w]*perfume/i, /admin/i];

  let flag = true;
  regexes.forEach((regex) => {
    if (regex.test(val)) {
      flag = false;
    }
  });

  if (!flag) {
    return Promise.reject("Store name contains invalid characters");
  }

  return true;
};

const checkStatus = (val) => {
  const stt = ["open", "close"];
  if (stt.indexOf(val) == -1) {
    return Promise.reject("Status is invalid, status type is enum value");
  }

  return true;
};

const checkCommission = (val) => {
  // console.log(val);
  return new Promise((resolve, reject) => {
    Commission.findOne({ _id: val, isDeleted: false })
      .exec()
      .then((commission) => {
        if (!commission) {
          reject("Commission not found");
        }
        resolve();
      })
      .catch((error) => {
        reject("Commission not found");
      });
  });
};

module.exports = {
  createStore,
  updateStore,
  activeStore,
  updateCommission,
  openStore,
};
