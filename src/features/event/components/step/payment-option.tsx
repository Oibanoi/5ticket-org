import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import clsx from "clsx";
import { join } from "path";

const PAYMENT_OPTIONS = [
  {
    id: "VNPAY_QR",
    label: "Quét QR chuyển khoản ngân hàng",
    note: "Scan mã QR từ ngân hàng hoặc ví điện tử của bạn",
    icon: "/icons/payment/QRVNPAY.svg",
  },
  {
    id: "VNPAY_DOMESTIC_CARD",
    label: "Thẻ ATM nội địa",
    note: "Vietnamese domestic payment card (NAPAS)",
    icon: "/icons/payment/napas.svg",
  },
  {
    id: "VNPAY_INTERNATIONAL_CARD",
    label: "Thẻ tín dụng/ghi nợ (VNPAY)",
    note: "Vietnamese International payment card",
    icon: "/icons/payment/visa.svg",
  },
  {
    id: "ONEPAY_INTERNATIONAL_CARD",
    label: "Thẻ tín dụng/ghi nợ (OnePay)",
    note: "All Region International payment card",
    icon: "/icons/payment/onepay.svg",
  },
  {
    id: "PAYX_QR",
    label: "Quét QR - PayX",
    note: "Scan mã QR từ ngân hàng hoặc ví điện tử của bạn",
    icon: "/icons/payment/PAYX.svg",
  },
  {
    id: "PAYX_DOMESTIC_CARD",
    label: "PayX thẻ ATM nội địa",
    note: "Vietnamese domestic payment card",
    icon: "/icons/payment/PAYX.svg",
  },
  {
    id: "PAYX_INTERNATIONAL_CARD",
    label: "PayX thẻ Quốc tế",
    note: "All Region International payment card",
    icon: "/icons/payment/PAYX.svg",
  },
];

export default function PaymentOption() {
  const { setValue, getValues, watch } = useFormContext();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const paymentOptionsValue = watch("payment_options");

  useEffect(() => {
    const init = paymentOptionsValue || getValues("payment_options");
    console.log("Initial payment_options:", init);
    if (Array.isArray(init)) {
      setSelected(init);
      setIsSelectAll(init.length === PAYMENT_OPTIONS.length);
    } else if (typeof init === "string" && init.trim() !== "") {
      const list = init
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setSelected(list);
      setIsSelectAll(list.length === PAYMENT_OPTIONS.length);
    } else {
      setSelected([]);
      setIsSelectAll(false);
    }
  }, [paymentOptionsValue, getValues, setValue]);

  const handleCheckboxChange = (value: string) => {
    let updated: string[];
    if (selected.includes(value)) {
      updated = selected.filter((v) => v !== value);
    } else {
      updated = [...selected, value];
    }
    setSelected(updated);
    setIsSelectAll(updated.length === PAYMENT_OPTIONS.length);
    setValue("payment_options", updated.join(","));
  };

  // ✅ Chọn tất cả
  const handleSelectAll = () => {
    const newState = !isSelectAll;
    setIsSelectAll(newState);
    const allIds = newState ? PAYMENT_OPTIONS.map((o) => o.id) : [];
    setSelected(allIds);
    setValue("payment_options", allIds.join(","));
  };

  return (
    <div className="space-y-4 pl-4">
      {/* Checkbox Chọn tất cả */}
      <div className="flex items-center gap-x-3">
        <Checkbox checked={isSelectAll} onChange={handleSelectAll}>
          <span className="text-sm font-medium">Chọn tất cả</span>
        </Checkbox>
      </div>

      {/* Danh sách các option */}
      {PAYMENT_OPTIONS.map((opt) => (
        <div
          key={opt.id}
          className={clsx(
            "flex items-center justify-between border border-gray-100 rounded-md py-2 px-3 hover:bg-gray-50 transition"
          )}
        >
          <div className="flex items-center gap-x-3">
            <Checkbox
              checked={selected.includes(opt.id)}
              onChange={() => handleCheckboxChange(opt.id)}
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.note}</p>
            </div>
          </div>
          <Image src={opt.icon} alt={opt.label} width={48} height={48} />
        </div>
      ))}
    </div>
  );
}
