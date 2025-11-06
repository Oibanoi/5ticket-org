"use client";
import { NextPage } from "next";
import PageCreateOrUpdateEvent from "components/events/PageCreateOrUpdateEvent";

const PageCreateEvent: NextPage = () => {
  return <PageCreateOrUpdateEvent mode="create" />;
};

export default PageCreateEvent;
