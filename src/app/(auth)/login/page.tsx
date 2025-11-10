"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Logo } from "shared/components/icon/logo";
import { Routers } from "shared/components/router";
import { env } from "shared/lib/env";
import { useDevelopmentMode } from "features/auth/components/useDevelopmentMode";
import { useAuth } from "shared/hooks/useAuth";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc email"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  savePassword: z.boolean().optional().default(false),
  isDevelopment: z.boolean().optional().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = decodeURIComponent(searchParams.get("callbackUrl") || Routers.EVENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect nếu đã đăng nhập
  const { redirectIfAuthenticated } = useAuth();

  useEffect(() => {
    redirectIfAuthenticated(callbackUrl);
  }, [redirectIfAuthenticated, callbackUrl]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      savePassword: false,
      isDevelopment: env.NEXT_PUBLIC_APP_ENV === "development",
    },
  });

  useDevelopmentMode({
    getValues,
    setValue,
    fieldName: "isDevelopment",
  });

  // Watch values for button disable and dev mode
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const isDevelopmentMode = watch("isDevelopment");
  const isFormValid = emailValue?.length >= 1 && passwordValue?.length >= 8;

  const onSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    try {
      router.prefetch(callbackUrl);

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        savePassword: values.savePassword,
        isDevelopment: values.isDevelopment,
        redirect: false,
      });

      if (response?.ok && response.status === 200) {
        toast.success("Đăng nhập thành công!");
        router.replace(callbackUrl);
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
      <div className="text-center space-y-6">
        {/* Logo with DEV Badge */}
        <div className="relative inline-flex items-center justify-center">
          <Logo className="fill-black dark:fill-light" fill="currentColor" />
          {isDevelopmentMode && (
            <div className="absolute -top-2 -right-2 animate-pulse">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></span>
                DEV
              </span>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">Đăng nhập để tiếp tục vào hệ thống</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tên đăng nhập hoặc Email
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  id="email"
                  size="large"
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập tên đăng nhập hoặc email"
                  status={fieldState.error ? "error" : ""}
                  disabled={isSubmitting}
                  autoComplete="username"
                  className="rounded-lg"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Mật khẩu
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Input.Password
                  {...field}
                  id="password"
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  status={fieldState.error ? "error" : ""}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="rounded-lg"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

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
          disabled={!isFormValid || isSubmitting}
          className="w-full h-12 text-base font-semibold rounded-lg"
        >
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <Logo className="fill-black dark:fill-light" fill="currentColor" />
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
