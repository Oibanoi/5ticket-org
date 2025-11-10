"use client";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PageCreateOrUpdateEvent, { EventFormData } from "components/events/PageCreateOrUpdateEvent";
import { toast } from "react-hot-toast";
import { getEventById, GetEventResponse } from "features/event/services/getEvent";
import api from "shared/lib/api";

// Transform API response to form data
const transformEventData = (apiData: GetEventResponse): EventFormData => {
  return {
    name: apiData.name,
    title: apiData.name,
    category: "",
    eventType: apiData.event_type,
    sponsoredBrands: apiData.sponsored_brands,
    province: apiData.province,
    ward: apiData.ward,
    startDate: new Date(apiData.start_date),
    endDate: new Date(apiData.end_date),
    location: apiData.location,
    blacklist: "",
    hotline: apiData.hotline,
    eventCode: apiData.prefix,
    slug: apiData.slug,
    allowGroupBooking: apiData.group_buy_enable,
    changeInfoDeadline: new Date(apiData.registration_change_start_date),
    checkinTime: new Date(apiData.checkin_start_date),
    paymentMethod: "auto",
    selectAllPayments: false,
    payment_options: apiData.payment_options,
    wall_paper_url: apiData.wall_paper_url,
    logo_url: apiData.logo_url,
    email_image_url: apiData.email_image_url,
    organizational_units: apiData.organizational_units,
    description: apiData.description,
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
  };
};

const PageEditEvent: NextPage = () => {
  const params = useParams();
  const eventId = params?.id as string;

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin sự kiện");
    }
  }, [error]);

  const eventData = apiData ? transformEventData(apiData) : null;
  console.log("eventData", eventData);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sự kiện</h2>
          <p className="text-gray-600">Sự kiện không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <PageCreateOrUpdateEvent mode="edit" eventId={eventId} defaultValues={eventData || undefined} />
  );
};

export default PageEditEvent;
