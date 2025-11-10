"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox } from "antd";
import { useDevelopmentMode } from "features/auth/components/useDevelopmentMode";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FormField } from "shared/components/form/FormField";
import { Logo } from "shared/components/icon/logo";
import { Routers } from "shared/components/router";
import z from "zod";
import { LoginHeader } from "./LoginHeader";


const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc email"),
  password: z.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .min(1, "Vui lòng nhập mật khẩu"),
  savePassword: z.boolean().optional(),
  isDevelopment: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useDevelopmentMode({
    getValues,
    setValue,
    fieldName: "isDevelopment",
  });

  const onSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    try {
      router.prefetch(Routers.EVENTS);

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        savePassword: values.savePassword,
        isDevelopment: values.isDevelopment,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Đăng nhập thành công!");
        window.location.href = Routers.EVENTS;
      } else {
        let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";

        if (response?.error) {
          if (response.error.includes("timeout") || response.error.includes("Timeout")) {
            errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại";
          } else if (response.error !== "CredentialsSignin") {
            errorMessage = response.error;
          }
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
      {/* Header */}
      <LoginHeader isDevelopment={getValues("isDevelopment")} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <FormField
          name="email"
          control={control}
          type="email"
          label="Tên đăng nhập hoặc Email"
          placeholder="Nhập tên đăng nhập hoặc email"
          icon="user"
          disabled={isSubmitting}
          autoComplete="username"
        />

        {/* Password Input */}
        <FormField
          name="password"
          control={control}
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          icon="lock"
          disabled={isSubmitting}
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Controller
            name="savePassword"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={field.onChange} disabled={isSubmitting}>
                <span className="text-sm text-gray-700 dark:text-gray-300">Ghi nhớ đăng nhập</span>
              </Checkbox>
            )}
          />
          <Link
            href={Routers.FORGOT}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold rounded-lg"
        >
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;