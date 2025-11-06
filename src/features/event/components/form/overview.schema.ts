import { z } from "zod";

export const overviewSchema = z.object({
  title: z.string().nonempty("Không được bỏ trống"),
  category: z.string().nonempty("Vui lòng chọn loại sự kiện"),
  location: z.string().nonempty("Không được bỏ trống"),
  eventCode: z.string().length(6, "Mã sự kiện phải gồm 6 ký tự"),
  startDate: z.string().nonempty("Bắt buộc chọn ngày bắt đầu"),
  endDate: z.string().nonempty("Bắt buộc chọn ngày kết thúc"),
  slug: z.string().nonempty("Slug không được trống"),
});
