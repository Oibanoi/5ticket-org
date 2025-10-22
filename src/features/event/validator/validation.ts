import Joi from "joi";

// Base validation schemas
export const eventValidationSchemas = {
  overview: Joi.object({
    title: Joi.string().required().min(3).max(100).messages({
      "string.empty": "Tên sự kiện là bắt buộc",
      "string.min": "Tên sự kiện phải có ít nhất 3 ký tự",
      "string.max": "Tên sự kiện không được quá 100 ký tự",
    }),
    category: Joi.string().required().messages({
      "string.empty": "Danh mục sự kiện là bắt buộc",
    }),
    startDate: Joi.date().required().min("now").messages({
      "date.base": "Ngày bắt đầu không hợp lệ",
      "date.min": "Ngày bắt đầu phải sau thời điểm hiện tại",
      "any.required": "Ngày bắt đầu là bắt buộc",
    }),
    endDate: Joi.date().required().min(Joi.ref("startDate")).messages({
      "date.base": "Ngày kết thúc không hợp lệ",
      "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
      "any.required": "Ngày kết thúc là bắt buộc",
    }),
    location: Joi.string().required().min(5).messages({
      "string.empty": "Địa điểm là bắt buộc",
      "string.min": "Địa điểm phải có ít nhất 5 ký tự",
    }),
    maxAttendees: Joi.number().integer().min(1).max(100000).messages({
      "number.base": "Số lượng tham gia phải là số",
      "number.min": "Số lượng tham gia phải lớn hơn 0",
      "number.max": "Số lượng tham gia không được quá 100,000",
    }),
  }),

  details: Joi.object({
    description: Joi.string().required().min(20).max(5000).messages({
      "string.empty": "Mô tả sự kiện là bắt buộc",
      "string.min": "Mô tả phải có ít nhất 20 ký tự",
      "string.max": "Mô tả không được quá 5000 ký tự",
    }),
    images: Joi.array().items(Joi.object()).min(1).max(10).messages({
      "array.min": "Cần ít nhất 1 hình ảnh",
      "array.max": "Không được quá 10 hình ảnh",
    }),
    tags: Joi.array().items(Joi.string()).max(10).messages({
      "array.max": "Không được quá 10 thẻ tag",
    }),
  }),

  tickets: Joi.object({
    tickets: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().messages({
            "string.empty": "Tên loại vé là bắt buộc",
          }),
          price: Joi.number().min(0).required().messages({
            "number.base": "Giá vé phải là số",
            "number.min": "Giá vé không được âm",
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Số lượng vé phải là số",
            "number.min": "Số lượng vé phải lớn hơn 0",
          }),
          description: Joi.string().allow("").max(500).messages({
            "string.max": "Mô tả vé không được quá 500 ký tự",
          }),
        })
      )
      .min(1)
      .messages({
        "array.min": "Cần ít nhất 1 loại vé",
      }),
  }),

  settings: Joi.object({
    isPublic: Joi.boolean().default(true),
    allowRegistration: Joi.boolean().default(true),
    registrationDeadline: Joi.date().min("now").messages({
      "date.min": "Hạn đăng ký phải sau thời điểm hiện tại",
    }),
    requireApproval: Joi.boolean().default(false),
    maxTicketsPerUser: Joi.number().integer().min(1).max(10).default(1).messages({
      "number.min": "Số vé tối đa mỗi người phải lớn hơn 0",
      "number.max": "Số vé tối đa mỗi người không được quá 10",
    }),
  }),
};

// File validation
export const fileValidation = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxFiles: 10,
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 5,
  },
};

// Utility functions
export const validateStep = (step: number, data: any) => {
  const schemas = [
    eventValidationSchemas.overview,
    eventValidationSchemas.details,
    eventValidationSchemas.tickets,
    eventValidationSchemas.settings,
  ];

  const schema = schemas[step];
  if (!schema) return { error: null, value: data };

  return schema.validate(data, { abortEarly: false });
};

export const validateFile = (file: File, type: "image" | "document" = "image") => {
  const config = fileValidation[type];

  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `File quá lớn. Tối đa ${config.maxSize / 1024 / 1024}MB`,
    };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Định dạng file không được hỗ trợ",
    };
  }

  return { isValid: true, error: null };
};
