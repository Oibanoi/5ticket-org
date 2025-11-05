// src/features/event/form/details.field.ts
export const detailsFields = {
  images: [
    {
      name: "wall_paper_url",
      label: "Ảnh bìa sự kiện",
      type: "upload",
      required: true,
      description: "Kích thước khuyến nghị: 1200x630px",
    },
    {
      name: "logo_url",
      label: "Logo sự kiện",
      type: "upload",
      description: "Kích thước khuyến nghị: 400x400px",
    },
    {
      name: "email_image_url",
      label: "Ảnh email",
      type: "upload",
      description: "Ảnh sử dụng trong email gửi vé",
    },
  ],

  organizational_units: [
    {
      name: "organizational_units",
      label: "Đơn vị tổ chức",
      type: "dynamic",
      fields: [
        {
          name: "name",
          label: "Tên đơn vị",
          type: "input",
          required: true,
          placeholder: "Nhập tên đơn vị tổ chức",
        },
        {
          name: "logo",
          label: "Logo đơn vị",
          type: "upload",
          description: "Logo của đơn vị tổ chức",
        },
      ],
    },
  ],

  descriptions: [
    {
      name: "descriptions",
      label: "Mô tả sự kiện",
      type: "dynamic",
      fields: [
        {
          name: "title",
          label: "Tiêu đề",
          type: "input",
          required: true,
          placeholder: "Nhập tiêu đề mô tả",
        },
        {
          name: "content",
          label: "Nội dung",
          type: "textarea",
          required: true,
          placeholder: "Nhập nội dung mô tả chi tiết",
          props: { rows: 4 },
        },
      ],
    },
  ],
};
