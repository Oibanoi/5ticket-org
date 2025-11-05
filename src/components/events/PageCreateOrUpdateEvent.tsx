"use client";
import Head from "next/head";
import Breadcrumbs from "shared/components/ui/breadcrumbs";
import { Routers } from "shared/components/router";
import Overview from "features/event/components/step/overview-step";
import Details from "features/event/components/step/details-step";
import { useState, useCallback, useEffect } from "react";
import "styles/globals.css";
import clsx from "clsx";
import Svg from "shared/components/icon/svg";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import Joi from "joi";
import FormStep from "features/event/components/step/form-step";
import StepTicket from "features/event/components/step/ticket-step";
import StepConfig from "features/event/components/step/config-step";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stepSchemas } from "features/event/validator/event.validator";
import { createEvent, updateEvent } from "features/event/services";
import { CreateEventPayload } from "features/event/types/api";
import { is } from "zod/v4/locales";

export interface EventFormData {
  name: string;
  title: string;
  category: string;
  eventType?: string;
  sponsoredBrands?: string;
  province?: string;
  ward?: string;
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
  payment_options?: string;
  wall_paper_url?: string;
  logo_url?: string;
  email_image_url?: string;
  organizational_units: Array<{ name: string; logo?: File | null }>;
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

interface PageCreateOrUpdateEventProps {
  eventId?: string;
  defaultValues?: Partial<EventFormData>;
  mode: "create" | "edit";
}

const steps: { label: string; disabled?: boolean }[] = [
  { label: "Tổng quan sự kiện" },
  { label: "Mô tả chi tiết" },
  { label: "Loại vé" },
  { label: "Cấu hình khác" },
  // { label: "Sơ đồ chỗ ngồi" },
];

const PageCreateOrUpdateEvent: React.FC<PageCreateOrUpdateEventProps> = ({
  eventId: propEventId,
  defaultValues: propDefaultValues,
  mode,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [eventId, setEventId] = useState<string | null>(propEventId || null);

  const isEditMode = mode === "edit";
  const parseDate = (v: any) => {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const fallbackDefaults: EventFormData = {
    name: "Sự kiện mẫu",
    title: "Sự kiện mẫu",
    category: "conference",
    eventType: "OTHER",
    sponsoredBrands: "",
    province: "",
    ward: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "Hà Nội",
    blacklist: "",
    hotline: "0987654321",
    eventCode: "EVENT1",
    slug: "su-kien-mau",
    allowGroupBooking: false,
    changeInfoDeadline: new Date(),
    checkinTime: new Date(),
    paymentMethod: "auto",
    selectAllPayments: false,
    payment_options: "",
    wall_paper_url: "",
    logo_url: "",
    email_image_url: "",
    organizational_units: [{ name: "Công ty ABC", logo: null }],
    descriptions: [
      {
        title: "Giới thiệu sự kiện",
        content:
          "Đây là mô tả mẫu cho sự kiện. Vui lòng cập nhật thông tin chi tiết về sự kiện của bạn.",
      },
    ],
    shows: [
      {
        id: 1,
        name: "Day 1",
        timeRange: [null, null],
        tickets: [
          {
            id: 1,
            name: "Vé thường",
            uniqueCode: "TICKET01",
            price: 100000,
            currency: "VND",
            isFree: false,
            totalTickets: 100,
            minPerOrder: 1,
            maxPerOrder: 10,
            startDate: null,
            endDate: null,
            description: "Vé thường dành cho tất cả khách hàng",
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
  };

  const mapToForm = (src?: any): Partial<EventFormData> => {
    if (!src) return {};
    const out: Partial<EventFormData> = {};

    out.title = src.title ?? src.name ?? undefined;
    out.name = src.name ?? out.title;
    out.eventType = src.eventType ?? undefined;
    out.location = src.location ?? undefined;
    out.hotline = src.hotline ?? undefined;
    out.eventCode = src.prefix ?? src.eventCode ?? undefined;
    out.slug = src.slug ?? undefined;
    out.allowGroupBooking = src.group_buy_enable ?? src.allowGroupBooking ?? false;
    out.paymentMethod = src.paymentMethod ?? src.payment_method ?? undefined;

    out.startDate = parseDate(src.start_date ?? src.startDate) ?? undefined;
    out.endDate = parseDate(src.end_date ?? src.endDate) ?? undefined;
    out.changeInfoDeadline =
      parseDate(src.registration_change_start_date ?? src.changeInfoDeadline) ?? undefined;
    out.checkinTime = parseDate(src.checkin_start_date ?? src.checkinTime) ?? undefined;
    out.payment_options = src.payment_options;

    out.logo_url = src.logo_url ?? "";
    out.wall_paper_url = src.wall_paper_url ?? "";
    out.email_image_url = src.email_image_url ?? "";

    if (Array.isArray(src.organizational_units)) {
      out.organizational_units = src.organizational_units.map((o: any) => ({
        name: o.name || o,
        logo: o.logo ?? null,
      }));
    }

    if (Array.isArray(src.descriptions)) {
      out.descriptions = src.descriptions.map((d: any) => ({
        title: d.title ?? "",
        content: d.content ?? d.description ?? "",
      }));
    } else if (src.description) {
      out.descriptions = [{ title: "Giới thiệu", content: src.description }];
    }

    if (Array.isArray(src.shows)) {
      out.shows = src.shows.map((s: any, idx: number) => {
        const timeStart = parseDate(s.start_date ?? s.timeRange?.[0]);
        const timeEnd = parseDate(s.end_date ?? s.timeRange?.[1]);
        return {
          id: s.id ?? idx + 1,
          name: s.name ?? s.title ?? `Show ${idx + 1}`,
          timeRange: [timeStart ? dayjs(timeStart) : null, timeEnd ? dayjs(timeEnd) : null],
          tickets: Array.isArray(s.tickets)
            ? s.tickets.map((t: any, tidx: number) => ({
                id: t.id ?? tidx + 1,
                name: t.name ?? t.title ?? "",
                uniqueCode: t.unique_code ?? t.uniqueCode ?? "",
                price: t.price ?? t.base_price ?? 0,
                currency: t.currency ?? t.currency ?? "VND",
                isFree: Boolean(t.isFree ?? t.is_free ?? false),
                totalTickets: t.totalTickets ?? t.total_tickets ?? 0,
                minPerOrder: t.minPerOrder ?? t.min_per_order ?? 1,
                maxPerOrder: t.maxPerOrder ?? t.max_per_order ?? 0,
                startDate: parseDate(t.start_date ?? t.startDate)
                  ? (dayjs(parseDate(t.start_date ?? t.startDate)) as any)
                  : null,
                endDate: parseDate(t.end_date ?? t.endDate)
                  ? (dayjs(parseDate(t.end_date ?? t.endDate)) as any)
                  : null,
                description: t.description ?? "",
              }))
            : [],
        };
      });
    }

    return out;
  };
  const initialDefaults: EventFormData = {
    ...fallbackDefaults,
    ...(mapToForm(propDefaultValues) as EventFormData),
  };
  const methods = useForm<EventFormData>({
    mode: "onChange",
    defaultValues: initialDefaults,
  });

  useEffect(() => {
    if (propDefaultValues) {
      const mapped = {
        ...fallbackDefaults,
        ...(mapToForm(propDefaultValues) as EventFormData),
      } as EventFormData;
      // debug: log mapped values when resetting so we can verify mapping
      // (remove or lower verbosity in production)
      // eslint-disable-next-line no-console
      console.debug("Mapped defaults for form reset:", mapped);
      methods.reset(mapped);
      // eslint-disable-next-line no-console
      console.debug("Form values after reset:", methods.getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propDefaultValues]);

  const {
    formState: { errors, dirtyFields },
    trigger,
    getValues,
  } = methods;
  const watchedValues = useWatch({ control: methods.control });

  // Update resolver when step changes
  useEffect(() => {
    const currentSchema = stepSchemas[step as keyof typeof stepSchemas] || Joi.object();
    methods.clearErrors();
    trigger();
  }, [step, methods, trigger]);

  // Helper functions
  const isGoNext = (e: any) => {
    const type = e?.nativeEvent?.submitter?.dataset?.type;
    return type === "next";
  };

  const getNextStep = (currentStep: number) => {
    let nextIndex = currentStep + 1;
    if (nextIndex === steps.length) {
      return router.push("/events");
    }

    for (nextIndex; nextIndex < steps.length; nextIndex++) {
      if (steps[nextIndex].disabled) continue;
      break;
    }

    return setStep(nextIndex);
  };

  // Step submission handlers
  const onSubmitOverview = async (values: EventFormData): Promise<boolean> => {
    try {
      const payload: CreateEventPayload = {
        id: eventId ? parseInt(eventId, 10) : undefined,
        name: values.title,
        sponsored_brands: "",
        event_type: values.eventType || "other",
        hotline: values.hotline || "",
        location: values.location,
        province: "",
        ward: "",
        prefix: values.eventCode || "",
        slug: values.slug || "",
        group_buy_enable: values.allowGroupBooking || false,
        start_date: values.startDate?.toISOString() || "",
        end_date: values.endDate?.toISOString() || "",
        registration_change_start_date: values.changeInfoDeadline?.toISOString() || "",
        registration_change_end_date: values.changeInfoDeadline?.toISOString() || "",
        transfer_start_date: values.startDate?.toISOString() || "",
        transfer_end_date: values.endDate?.toISOString() || "",
        checkin_start_date: values.checkinTime?.toISOString() || "",
        checkin_end_date: values.endDate?.toISOString() || "",
        payment_options: values.payment_options || "",
        logo_url: initialDefaults.logo_url || "",
        wall_paper_url: initialDefaults.wall_paper_url || "",
        email_image_url: initialDefaults.email_image_url || "",
        organizational_units: JSON.stringify(initialDefaults.organizational_units || []),
        description: JSON.stringify(initialDefaults.descriptions || []),
        is_enable: true,
        base_price: 0,
        add_or_update_blacklist:
          values.blacklist && Array.isArray(values.blacklist)
            ? values.blacklist.map((item) => ({
                value: item,
                type: "OTHER",
                is_enabled: true,
              }))
            : [],
      };

      if (isEditMode && eventId) {
        await updateEvent(eventId, payload);
        toast.success("Cập nhật sự kiện thành công!");
      } else {
        const result = await createEvent(payload);
        setEventId(String(result.id));
        toast.success("Tạo sự kiện thành công!");
      }

      return true;
    } catch (error) {
      toast.error(
        isEditMode ? "Có lỗi xảy ra khi cập nhật sự kiện" : "Có lỗi xảy ra khi tạo sự kiện"
      );
      return false;
    }
  };

  const onSubmitInfo = async (values: EventFormData): Promise<boolean> => {
    try {
      const schema = stepSchemas[1];
      if (schema) {
        const { error } = schema.validate(values, { abortEarly: false });
        if (error) {
          error.details.forEach((detail) => {
            methods.setError(detail.path.join(".") as any, { message: detail.message });
          });
          return false;
        }
      }

      if (!eventId) {
        toast.error("Event ID không tồn tại");
        return false;
      }

      const payload: CreateEventPayload = {
        id: parseInt(eventId, 10),
        name: values.title,
        sponsored_brands: "",
        event_type: values.eventType || "other",
        hotline: values.hotline || "",
        location: values.location,
        province: "",
        ward: "",
        prefix: values.eventCode || "",
        slug: values.slug || "",
        group_buy_enable: values.allowGroupBooking || false,
        start_date: values.startDate?.toISOString() || "",
        end_date: values.endDate?.toISOString() || "",
        registration_change_start_date: values.changeInfoDeadline?.toISOString() || "",
        registration_change_end_date: values.changeInfoDeadline?.toISOString() || "",
        transfer_start_date: values.startDate?.toISOString() || "",
        transfer_end_date: values.endDate?.toISOString() || "",
        checkin_start_date: values.checkinTime?.toISOString() || "",
        checkin_end_date: values.endDate?.toISOString() || "",
        payment_options: values.payment_options || "",
        logo_url: values.logo_url || "",
        wall_paper_url: values.wall_paper_url || "",
        email_image_url: values.email_image_url || "",
        organizational_units: JSON.stringify(values.organizational_units || []),
        description: JSON.stringify(values.descriptions || []),
        is_enable: true,
        base_price: 0,
        add_or_update_blacklist:
          values.blacklist && Array.isArray(values.blacklist)
            ? values.blacklist.map((item) => ({
                value: item,
                type: "OTHER",
                is_enabled: true,
              }))
            : [],
      };

      await updateEvent(eventId, payload);
      toast.success("Cập nhật thông tin chi tiết thành công!");
      return true;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      return false;
    }
  };

  const onSubmitTickets = async (values: EventFormData): Promise<boolean> => {
    try {
      const schema = stepSchemas[2];
      if (schema) {
        const { error } = schema.validate(values, { abortEarly: false });
        if (error) {
          error.details.forEach((detail) => {
            methods.setError(detail.path.join(".") as any, { message: detail.message });
          });
          return false;
        }
      }
      toast.success("Cập nhật vé thành công!");
      return true;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật vé");
      return false;
    }
  };

  const onSubmitConfigs = (values: EventFormData): boolean => {
    try {
      const schema = stepSchemas[3];
      if (schema) {
        const { error } = schema.validate(values, { abortEarly: false });
        if (error) {
          error.details.forEach((detail) => {
            methods.setError(detail.path.join(".") as any, { message: detail.message });
          });
          return false;
        }
      }
      toast.success("Cập nhật cấu hình thành công!");
      return true;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật cấu hình");
      return false;
    }
  };

  // const onSubmitRules = async (values: EventFormData): Promise<boolean> => {
  //   try {
  //     const schema = stepSchemas[4];
  //     if (schema) {
  //       const { error } = schema.validate(values, { abortEarly: false });
  //       if (error) {
  //         error.details.forEach((detail) => {
  //           methods.setError(detail.path.join(".") as any, { message: detail.message });
  //         });
  //         return false;
  //       }
  //     }
  //     console.log("Finalizing event for eventId:", eventId);
  //     toast.success("Hoàn thành tạo sự kiện!");
  //     return true;
  //   } catch (error) {
  //     toast.error("Có lỗi xảy ra khi hoàn thành sự kiện");
  //     return false;
  //   }
  // };

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
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

  // Form error handler
  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
  };

  // Main form submission handler
  const onSubmit = async (values: EventFormData, e: any) => {
    setIsSubmitting(true);
    const isNext = isGoNext(e);

    if (step !== 0 && !eventId && !isEditMode) {
      setIsSubmitting(false);
      return toast.error("Không thể cập nhật bước này.");
    }

    let success = false;
    try {
      switch (step) {
        case 0:
          success = await onSubmitOverview(values);
          break;
        case 1:
          success = await onSubmitInfo(values);
          break;
        case 2:
          success = await onSubmitTickets(values);
          break;
        case 3:
          success = onSubmitConfigs(values);
          break;
        // case 4:
        //   success = await onSubmitRules(values);
        //   break;
      }
      if (success) {
        setCompletedSteps((prev) => new Set([...prev, step]));
      }

      if (isNext && success) {
        getNextStep(step);
      }
    } catch (error) {
      console.error("Submit error:", error);
      success = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[step as keyof typeof stepSchemas];
    if (!schema) return true;

    const values = getValues();
    const { error } = schema.validate(values, { abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        methods.setError(detail.path.join(".") as any, { message: detail.message });
      });
      return false;
    }

    methods.clearErrors();
    return true;
  };

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
    [step, completedSteps, getValues, methods]
  );

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
  }, [dirtyFields, getValues, saveDraftMutation, step]);

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
        <title>5bib - {isEditMode ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}</title>
      </Head>
      <div>
        <Breadcrumbs
          pages={[
            { href: Routers.HOME, title: "Trang chủ" },
            { href: Routers.HOME, title: "Danh sách sự kiện" },
            {
              href: Routers.EVENTS_CREATE,
              title: isEditMode ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới",
            },
          ]}
        />

        <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-14">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {isEditMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
          </h1>
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
            <form
              onSubmit={methods.handleSubmit(onSubmit, onError)}
              autoComplete="off"
              autoCorrect="off"
            >
              {(uploadMutation.isPending || isSubmitting) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">
                      {uploadMutation.isPending ? "Đang tải file..." : "Đang xử lý..."}
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
                  <Overview />
                </FormStep.Step>
                <FormStep.Step>
                  <Details />
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
                    type="submit"
                    data-type="next"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? "Đang xử lý..."
                      : step === steps.length - 1
                      ? isEditMode
                        ? "Cập nhật sự kiện"
                        : "Tạo sự kiện"
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

export default PageCreateOrUpdateEvent;
