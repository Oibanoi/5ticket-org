import { post } from "shared/lib/api/fetcher";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await post<{ url: string }>("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Upload image response:", res);
    return res.data.url; // Trả về link ảnh
  } catch (error) {
    console.error("Upload image failed:", error);
    throw new Error("Không thể upload ảnh");
  }
}
