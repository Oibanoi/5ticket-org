"use client";

import { useState } from "react";
import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "components/button/button";
import Svg from "shared/components/icon/svg";
import InputWithIcons from "components/input/input-with-icons";
import { Routers } from "shared/components/router";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { env } from "shared/lib/env";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      isDevelopment: env.NEXT_PUBLIC_APP_ENV === "development",
      savePassword: false,
    },
  });

  const isDev = useWatch({ control, name: "isDevelopment" });

  const onSubmit: SubmitHandler<LoginFormData> = async (values) => {
    try {
      router.prefetch(Routers.EVENTS);

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        savePassword: values.savePassword,
        isDevelopment: values.isDevelopment,
        redirect: false,
      });

      if (response?.ok && response.status === 200) {
        onSuccess?.();
        router.replace(Routers.EVENTS);
      } else {
        let errorMessage = "Username/ mật khẩu sai vui lòng kiểm tra lại";
        
        if (response?.error) {
          if (response.error.includes("timeout") || response.error.includes("Timeout")) {
            errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại";
          } else if (response.error !== "CredentialsSignin") {
            errorMessage = response.error;
          }
        }

        setError("root", { message: errorMessage });
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại";
      setError("root", { message: errorMessage });
      onError?.(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-gray-600 text-xs px-2.5">
          Tên đăng nhập
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <InputWithIcons
              {...field}
              id="email"
              disabled={isSubmitting}
              className="w-full mt-1"
              placeholder="@mailname.com"
              isInvalid={Boolean(fieldState.error)}
              autoComplete="email"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 px-2.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-600 text-xs px-2.5">
          Mật khẩu
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <InputWithIcons
              {...field}
              id="password"
              disabled={isSubmitting}
              className="w-full mt-1"
              placeholder="************"
              type={isShowPassword ? "text" : "password"}
              isInvalid={Boolean(fieldState.error)}
              autoComplete="current-password"
              onClickTrailing={() => setIsShowPassword(!isShowPassword)}
              trailing={isShowPassword ? "/icons/eye-blink.svg" : "/icons/eye-open.svg"}
            />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 px-2.5">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <div className="flex items-center text-red-500">
          <span className="text-sm">{errors.root.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center text-secondary-600 font-bold select-none cursor-pointer">
          <input
            type="checkbox"
            {...register("savePassword")}
            className="checkbox mr-2"
            disabled={isSubmitting}
          />
          <span className="text-sm">Lưu mật khẩu</span>
        </label>
        <Link href={Routers.FORGOT} className="text-gray-500 font-bold text-sm hover:text-gray-700">
          Quên mật khẩu?
        </Link>
      </div>

      <input type="hidden" {...register("isDevelopment")} />

      <div className="form-actions mt-6">
        <Button
          data-test="submit"
          isLoading={isSubmitting}
          htmlType="submit"
          type="primary"
          className="w-full"
          disabled={isSubmitting || !isValid}
        >
          Đăng nhập
        </Button>
      </div>

      {isDev && (
        <div className="text-center">
          <span className="inline-block text-xs rounded-md bg-yellow-100 text-yellow-800 px-2 py-1">
            Development Mode
          </span>
        </div>
      )}
    </form>
  );
}

