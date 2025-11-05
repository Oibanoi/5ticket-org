import Joi from "joi";

export const detailsSchema = Joi.object({
  // Images
  wall_paper_url: Joi.array().items(Joi.object()).min(1).required().messages({
    "array.min": "Ảnh bìa sự kiện là bắt buộc",
    "any.required": "Ảnh bìa sự kiện là bắt buộc",
  }),
  logo_url: Joi.array().items(Joi.object()).optional(),
  email_image_url: Joi.array().items(Joi.object()).optional(),

  // Organizers
  "organizational units": Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "string.empty": "Tên đơn vị tổ chức là bắt buộc",
          "any.required": "Tên đơn vị tổ chức là bắt buộc",
        }),
        logo: Joi.any().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất một đơn vị tổ chức",
      "any.required": "Đơn vị tổ chức là bắt buộc",
    }),

  // Descriptions
  descriptions: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required().messages({
          "string.empty": "Tiêu đề mô tả là bắt buộc",
          "any.required": "Tiêu đề mô tả là bắt buộc",
        }),
        content: Joi.string().required().messages({
          "string.empty": "Nội dung mô tả là bắt buộc",
          "any.required": "Nội dung mô tả là bắt buộc",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất một mô tả sự kiện",
      "any.required": "Mô tả sự kiện là bắt buộc",
    }),
});
