import React, { useEffect } from "react";
import { Card, Radio } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { overviewFields } from "../form/overview.field";
import RenderField from "../RenderField";
import PaymentOption from "./payment-option";

type FieldType =
  | "input"
  | "select"
  | "date"
  | "switch"
  | "checkbox"
  | "radio"
  | "textarea"
  | "number"
  | "checkboxGroup"
  | "upload"
  | "inputTag";

const Overview: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
  const title = watch("title");

  useEffect(() => {
    if (title) {
      setValue(
        "slug",
        title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-")
      );
    }
  }, [title, setValue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-6">
      {/* --- Cột trái: Thông tin chung --- */}
      <Card title="Thông tin chung" className="shadow-sm rounded-lg">
        <div className="space-y-4">
          {overviewFields.general.map((f, i) =>
            // "group" in f && f.group === "row" && "fields" in f ? (
            //   <div key={i} className="flex gap-3">
            //     {f.fields.map((inner) => (
            //       <div key={inner.name} className="flex-1">
            //         <RenderField {...inner} type={inner.type as FieldType} />
            //       </div>
            //     ))}
            //   </div>
            // ) :
            "name" in f && f.name ? (
              <RenderField
                key={f.name}
                name={f.name}
                label={f.label}
                type={f.type as FieldType}
                required={f.required}
                placeholder={f.placeholder}
                options={f.options}
                description={f.description}
                props={(f as any).props}
              />
            ) : null
          )}
        </div>
      </Card>

      {/* --- Cột phải: Mốc thời gian + Thanh toán --- */}
      <div className="flex flex-col gap-6">
        {/* Mốc thời gian */}
        <Card title="Mốc thời gian" className="shadow-sm rounded-lg">
          <div className="space-y-4">
            {overviewFields.timeline.map((f) => (
              <RenderField key={f.name} {...f} type={f.type as FieldType} />
            ))}
          </div>
        </Card>

        {/* Phương thức thanh toán */}
        <Card title="Phương thức thanh toán" className="shadow-sm rounded-lg">
          <PaymentOption />
        </Card>
      </div>
    </div>
  );
};

export default Overview;
