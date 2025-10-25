import Joi from "joi";

export const stepSchemas = {
  0: Joi.object({
    title: Joi.string().required().messages({ "string.empty": "Tên sự kiện là bắt buộc" }),
    category: Joi.string().required().messages({ "string.empty": "Loại sự kiện là bắt buộc" }),
    startDate: Joi.date().required().messages({ "date.base": "Thời gian diễn ra là bắt buộc" }),
    endDate: Joi.date().min(Joi.ref("startDate")).required().messages({
      "date.base": "Thời gian kết thúc là bắt buộc",
      "date.min": "Thời gian kết thúc phải sau thời gian bắt đầu",
    }),
    location: Joi.string().required().messages({ "string.empty": "Địa điểm là bắt buộc" }),
  }).unknown(true),
  1: Joi.object({
    descriptions: Joi.array().min(1).required().messages({ "array.min": "Cần ít nhất 1 mô tả" }),
    // coverImage: Joi.array().min(1).messages({ "array.min": "Ảnh bìa là bắt buộc" }),
    organizers: Joi.array()
      .min(1)
      .required()
      .messages({ "array.min": "Cần ít nhất 1 đơn vị tổ chức" }),
  }).unknown(true),
  2: Joi.object({
    shows: Joi.array().min(1).required().messages({ "array.min": "Cần ít nhất 1 suất diễn" }),
  }).unknown(true),
  3: Joi.object({
    categories: Joi.array()
      .min(1)
      .required()
      .messages({ "array.min": "Cần ít nhất 1 danh mục cấu hình" }),
  }).unknown(true),
};
