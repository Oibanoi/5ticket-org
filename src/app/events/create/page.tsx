"use client";
import { NextPage } from "next";
import Head from "next/head";
import Breadcrumbs from "shared/components/ui/breadcrumbs";
import { Routers } from "shared/components/router";
import Overview from "features/event/components/step/overview-step";
import Details from "features/event/components/step/details-step";
import { useState, useCallback, useEffect } from "react";
import "styles/globals.css";
import clsx from "clsx";
import Svg from "shared/components/icon/svg";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import FormStep from "features/event/components/step/form-step";
import StepTicket from "features/event/components/step/ticket-step";
import StepConfig from "features/event/components/step/config-step";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stepSchemas } from "features/event/validator/event.validator";
// Validation schemas cho từng step

const steps: { label: string; disabled?: boolean }[] = [
  { label: "Tổng quan sự kiện" },
  { label: "Mô tả chi tiết" },
  { label: "Loại vé" },
  { label: "Cấu hình khác" },
  { label: "Sơ đồ chỗ ngồi" },
];

interface EventFormData {
  title: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  blacklist?: string;
  hotline?: string;
  eventCode?: string;
  slug?: string;
  allowGroupBooking?: boolean;
  changeInfoDeadline?: Date;
  checkinTime?: Date;
  paymentMethod?: string;
  selectAllPayments?: boolean;
  paymentOptions?: Record<string, boolean>;
  coverImage?: File[];
  logoImage?: File[];
  emailImage?: File[];
  organizers: Array<{ name: string; logo?: File | null }>;
  descriptions: Array<{ title: string; content: string }>;
  shows: Array<{
    id: number;
    name: string;
    timeRange: [Date | null, Date | null];
    tickets: Array<{
      id: number;
      name: string;
      uniqueCode: string;
      price: number;
      currency: string;
      isFree: boolean;
      totalTickets: number;
      minPerOrder: number;
      maxPerOrder: number;
      startDate: Date | null;
      endDate: Date | null;
      description: string;
    }>;
  }>;
  categories: Array<{
    id: number;
    name: string;
    expanded: boolean;
    fields: Array<{
      id: number;
      name: string;
      type: string;
      defaultValue: string;
      note: string;
      attachment: string;
      required: boolean;
      options?: string;
    }>;
  }>;
}

const PageCreateEvent: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const methods = useForm<EventFormData>({
    resolver: joiResolver(stepSchemas[step as keyof typeof stepSchemas] || Joi.object()),
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      blacklist: "",
      hotline: "",
      eventCode: "",
      slug: "",
      allowGroupBooking: false,
      changeInfoDeadline: new Date(),
      checkinTime: new Date(),
      paymentMethod: "auto",
      selectAllPayments: false,
      paymentOptions: {
        payxQr: false,
        payxAtm: false,
        payxIntl: false,
        bankQr: false,
        atmCard: false,
        creditCard: false,
      },
      coverImage: [],
      logoImage: [],
      emailImage: [],
      organizers: [{ name: "", logo: null }],
      descriptions: [{ title: "", content: "" }],
      shows: [
        {
          id: 1,
          name: "Day 1",
          timeRange: [null, null],
          tickets: [
            {
              id: 1,
              name: "",
              uniqueCode: "",
              price: 0,
              currency: "VND",
              isFree: false,
              totalTickets: 0,
              minPerOrder: 1,
              maxPerOrder: 0,
              startDate: null,
              endDate: null,
              description: "",
            },
          ],
        },
      ],
      categories: [
        {
          id: 1,
          name: "Cat 1",
          expanded: true,
          fields: [
            {
              id: 1,
              name: "Default",
              type: "text",
              defaultValue: "",
              note: "",
              attachment: "",
              required: true,
            },
          ],
        },
      ],
    },
  });

  const {
    formState: { errors, dirtyFields, isValid },
    trigger,
    getValues,
  } = methods;
  const watchedValues = useWatch({ control: methods.control });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            }
          };
          xhr.onload = () => resolve(JSON.parse(xhr.responseText));
          xhr.onerror = reject;
          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });
      });

      return Promise.all(uploadPromises);
    },
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<EventFormData>) => {
      const response = await fetch("/api/events/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Đã lưu bản nháp");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Submit event mutation
  const submitMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Tạo sự kiện thành công!");
      router.push("/events");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo sự kiện");
    },
  });

  // Validate current step
  const validateCurrentStep = useCallback(async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCompletedSteps((prev) => new Set([...prev, step]));
    }
    return isStepValid;
  }, [step, trigger]);

  // Handle step change
  const onChangeStep = useCallback(
    async (newStep: number) => {
      if (newStep < step || completedSteps.has(newStep)) {
        setStep(newStep);
        return;
      }

      const isValid = await validateCurrentStep();
      if (isValid) {
        setStep(newStep);
      }
    },
    [step, completedSteps, validateCurrentStep]
  );

  // Handle continue
  const handleContinue = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && step < steps.length - 1) {
      setStep(step + 1);
    } else if (isValid && step === steps.length - 1) {
      await handleSubmit();
    }
  }, [step, validateCurrentStep]);

  // Handle save draft
  const handleSaveDraft = useCallback(async () => {
    const data = getValues();
    const dirtyData = Object.keys(dirtyFields).reduce((acc, key) => {
      (acc as any)[key] = (data as any)[key];
      return acc;
    }, {} as Partial<EventFormData>);

    if (Object.keys(dirtyData).length > 0) {
      saveDraftMutation.mutate(dirtyData);
    }
  }, [dirtyFields, getValues, saveDraftMutation]);

  // Handle final submit
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const data = getValues();

      // Upload files first if any
      const filesToUpload = [
        ...(data.coverImage || []),
        ...(data.logoImage || []),
        ...(data.emailImage || []),
      ];

      if (filesToUpload.length > 0) {
        const uploadedFiles = await uploadMutation.mutateAsync(filesToUpload);
        // Map uploaded files back to respective fields
        let fileIndex = 0;
        if (data.coverImage?.length) {
          data.coverImage = uploadedFiles.slice(
            fileIndex,
            fileIndex + data.coverImage.length
          ) as any;
          fileIndex += data.coverImage?.length || 0;
        }
        if (data.logoImage?.length) {
          data.logoImage = uploadedFiles.slice(fileIndex, fileIndex + data.logoImage.length) as any;
          fileIndex += data.logoImage?.length || 0;
        }
        if (data.emailImage?.length) {
          data.emailImage = uploadedFiles.slice(
            fileIndex,
            fileIndex + data.emailImage.length
          ) as any;
        }
      }

      await submitMutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [getValues, uploadMutation, submitMutation]);

  // Auto-save on dirty fields change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(dirtyFields).length > 0) {
        handleSaveDraft();
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [dirtyFields, handleSaveDraft]);
  return (
    <>
      <Head>
        <title>5bib - Thêm sự kiện mới</title>
      </Head>
      <div>
        <Breadcrumbs
          pages={[
            { href: Routers.HOME, title: "Trang chủ" },
            { href: Routers.HOME, title: "Danh sách sự kiện" },
            { href: Routers.EVENTS_CREATE, title: "Thêm sự kiện mới" },
          ]}
        />

        <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-14">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Tạo sự kiện mới</h1>
          <div
            aria-label="step-list"
            className="step-group -space-x-2 lg:-space-x-8 overflow-x-auto"
          >
            {steps.map(({ label, disabled }, index) => {
              if (disabled) return null;
              const isCompleted = completedSteps.has(index);
              const isAccessible = index === 0 || completedSteps.has(index - 1);

              return (
                <button
                  key={label}
                  className={clsx(
                    "step select-none gap-x-2.5 whitespace-nowrap text-xs lg:text-sm",
                    {
                      "step-done": isCompleted,
                      "step-active": step === index,
                      "text-gray-300 cursor-not-allowed": !isAccessible,
                    }
                  )}
                  onClick={() => isAccessible && onChangeStep(index)}
                  disabled={!isAccessible}
                  style={{ zIndex: steps.length - index }}
                >
                  <Svg
                    src={clsx({
                      "/icons/step_done.svg": isCompleted,
                      // "/icons/step_hold.svg": step === index,
                      "/icons/step_wait.svg": !isCompleted && step !== index,
                    })}
                    width={16}
                    height={16}
                    className="lg:w-5 lg:h-5"
                  />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <section className="mt-6 text-sm" data-step={step}>
          <FormProvider {...methods}>
            <form autoComplete="off" autoCorrect="off">
              {/* Progress indicator */}
              {(uploadMutation.isPending || isSubmitting) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">
                      {uploadMutation.isPending ? "Đang tải file..." : "Đang tạo sự kiện..."}
                    </span>
                  </div>
                  {Object.entries(uploadProgress).map(([filename, progress]) => (
                    <div key={filename} className="mb-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{filename}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error display */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Vui lòng kiểm tra lại:</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    {Object.entries(errors).map(([field, error]) => {
                      const message = (error as { message?: string })?.message ?? "";
                      return message ? <li key={field}>• {message}</li> : null;
                    })}
                  </ul>
                </div>
              )}

              <FormStep step={step}>
                <FormStep.Step>
                  <Overview
                  //  uploadProgress={uploadProgress}
                  />
                </FormStep.Step>
                <FormStep.Step>
                  <Details
                  //  uploadProgress={uploadProgress}
                  />
                </FormStep.Step>
                <FormStep.Step>
                  <StepTicket />
                </FormStep.Step>
                <FormStep.Step>
                  <StepConfig />
                </FormStep.Step>
              </FormStep>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {Object.keys(dirtyFields).length > 0 && (
                    <>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span>Có thay đổi chưa lưu</span>
                    </>
                  )}
                  {saveDraftMutation.isPending && (
                    <span className="text-blue-600">Đang lưu...</span>
                  )}
                </div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Quay lại
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saveDraftMutation.isPending || Object.keys(dirtyFields).length === 0}
                    className="px-4 py-2 border rounded-md bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saveDraftMutation.isPending ? "Đang lưu..." : "Lưu lại"}
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!isValid || isSubmitting}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? "Đang xử lý..."
                      : step === steps.length - 1
                      ? "Tạo sự kiện"
                      : "Tiếp tục"}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </section>
      </div>
    </>
  );
};

export default PageCreateEvent;
