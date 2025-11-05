// src/features/event/form/overview.field.ts
export const overviewFields = {
  general: [
    {
      name: "title",
      label: "Tên sự kiện",
      type: "input",
      required: true,
      placeholder: "Nhập vào tên sự kiện",
    },
    {
      name: "eventType",
      label: "Loại sự kiện",
      type: "select",
      required: true,
      placeholder: "Chọn loại sự kiện",
      options: [
        { value: "THEATER_ART", label: "Sân khấu nghệ thuật" },
        { value: "MUSIC", label: "Ca nhạc" },
        { value: "SPORT", label: "Thể thao" },
        { value: "SEMINAR", label: "Hội thảo" },
        { value: "OTHER", label: "Khác" },
      ],
    },
    {
      name: "blacklist",
      label: "Blacklist",
      type: "inputTag",
      placeholder: "Nhập email hoặc sđt, nhấn Enter để thêm",
      description: "Email hoặc số điện thoại của người mà bạn muốn từ chối phục vụ trong sự kiện.",
    },
    {
      name: "location",
      label: "Địa điểm diễn ra",
      type: "input",
      required: true,
      placeholder: "Nhập địa điểm",
    },
    {
      group: "row",
      fields: [
        {
          name: "hotline",
          label: "Hotline",
          type: "input",
          placeholder: "0987654321",
        },
        {
          name: "eventCode",
          label: "Mã sự kiện",
          type: "input",
          required: true,
          placeholder: "6 kí tự",
          props: { maxLength: 6 },
        },
      ],
    },
    {
      name: "slug",
      label: "Slug của sự kiện",
      type: "input",
      required: true,
      placeholder: "slug-su-kien",
    },
    {
      name: "allowGroupBooking",
      label: "Cho phép mua vé theo nhóm",
      type: "switch",
    },
  ],

  timeline: [
    { name: "startDate", label: "Thời gian diễn ra", type: "date", required: true },
    { name: "endDate", label: "Thời gian kết thúc", type: "date", required: true },
    { name: "changeInfoDeadline", label: "Thời gian thay đổi thông tin", type: "date" },
    { name: "checkinTime", label: "Thời gian mở checkin", type: "date" },
  ],

  payment: {
    radio: {
      name: "paymentMethod",
      options: [{ value: "auto", label: "Thanh toán tự động qua trung gian thanh toán" }],
      description: "Vé sẽ được gửi về tài khoản của người tổ chức khi thanh toán thành công",
    },
    selectAll: {
      name: "selectAllPayments",
      label: "Chọn tất cả",
      type: "checkbox",
    },
    options: [
      { key: "payxQr", label: "Quét QR chuyển khoản ngân hàng - PayX QR" },
      { key: "payxAtm", label: "PayX thẻ ATM nội địa" },
      { key: "payxIntl", label: "PayX thẻ Quốc tế" },
      { key: "bankQr", label: "Quét QR chuyển khoản ngân hàng" },
      { key: "atmCard", label: "Thẻ ATM nội địa" },
      { key: "creditCard", label: "Thẻ tín dụng/ghi nợ" },
    ],
  },
};
