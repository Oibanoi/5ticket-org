"use client";
import { NextPage } from "next";
import Head from "next/head";
import Breadcrumbs from "shared/components/breadcrumbs";
import { Routers } from "shared/components/router";
import Overview from "components/events/overview";
import Details from "components/events/details";
import { useState } from "react";
import "styles/globals.css";
import clsx from "clsx";
import Svg from "shared/components/icon/svg";
import {
  DefaultValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { Button } from "antd";
import FormStep from "components/events/form-step";
const steps: { label: string; disabled?: boolean }[] = [
  { label: "Tổng quan sự kiện" },
  { label: "Mô tả chi tiết" },
  { label: "Loại vé" },
  { label: "Cấu hình khác", disabled: true },
  { label: "Điều khoản tham gia" },
  { label: "Cấu hình khác" },
];

const PageCreateEvent: NextPage = () => {
  const methods = useForm({
    defaultValues: {
      // các giá trị mặc định
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [step, setStep] = useState(0);
  const onChangeStep = (step: number) => {
    setStep(step);
  };
  return (
    <>
      <Head>
        <title>5bib - Thêm sự kiện mới</title>
      </Head>
      <div className="p-6">
        <Breadcrumbs
          pages={[
            { href: Routers.HOME, title: "Trang chủ" },
            { href: Routers.HOME, title: "Danh sách sự kiện" },
            { href: Routers.EVENTS_CREATE, title: "Thêm sự kiện mới" },
          ]}
        />

        <div className="mt-4">
          <div aria-label="step-list" className="step-group -space-x-8">
            {steps.map(({ label, disabled }, index) => {
              if (disabled) return null;
              return (
                <button
                  key={label}
                  className={clsx(
                    "step select-none gap-x-2.5 disabled:text-gray-300 disabled:cursor-not-allowed",
                    {
                      "step-done": step > index,
                      "step-active": step === index,
                    }
                  )}
                  onClick={() => onChangeStep(index)}
                  // disabled={Boolean(index && !raceId)}
                  style={{ zIndex: steps.length - index }}
                >
                  <Svg
                    src={clsx({
                      "/icons/step_done.svg": step > index,
                      "/icons/step_hold.svg": step === index,
                      "/icons/step_wait.svg": step < index,
                    })}
                    width={20}
                    height={20}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <section className="mt-6 text-sm" data-step={step}>
          <FormProvider {...methods}>
            <form
              // onSubmit={methods.handleSubmit(onSubmit, onError)}
              autoComplete="off"
              autoCorrect="off"
            >
              <FormStep step={step}>
                <FormStep.Step>
                  <Overview />
                </FormStep.Step>
                <FormStep.Step>
                  <Details />
                </FormStep.Step>
                {/* <FormStep.Step>
                  <StepTicket />
                </FormStep.Step>
                <FormStep.Step>
                  <StepConfig />
                </FormStep.Step>
                <FormStep.Step>
                  <StepRules handleSaveUrl={handleSaveUrl} isSubmitAllowed={isSubmitAllowed} />
                </FormStep.Step>
                <FormStep.Step>
                  <CustomField />
                </FormStep.Step> */}
              </FormStep>
              <div className="col-span-1 lg:col-span-3 flex justify-end gap-3">
                <button className="px-4 py-2 border rounded-md bg-white text-blue-600">
                  Lưu lại
                </button>
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Tiếp tục</button>
              </div>
              {/* {!modalst && (
                <PopupLog
                  open={!modalst}
                  onClose={() => setModalst(true)}
                  onCloseCallback={onCloseCallback}
                  messenger={
                    <>
                      Miễn trừ trách nhiệm chưa được lưu!
                      <br />
                      Xác nhận và tiếp tục.
                    </>
                  }
                />
              )} */}
            </form>
          </FormProvider>
        </section>
      </div>
    </>
  );
};

export default PageCreateEvent;
