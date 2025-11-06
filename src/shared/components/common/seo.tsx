import Head from "next/head";
import React from "react";

type SeoTagParams = {
  title?: string;
  description?: string;
};
const Seo = (props: SeoTagParams) => {
  return (
    <Head>
      <title key="title">{props.title + " | 5BIB"}</title>
      <meta name="description" content={props.description} />
    </Head>
  );
};

export default Seo;
