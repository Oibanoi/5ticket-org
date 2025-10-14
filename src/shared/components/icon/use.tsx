"use client";
import React, { useEffect, useState } from "react";

let id = 0;
let element: HTMLElement | null = null;
const element_Id = "ICON_ID";
type Props = {} & React.SVGProps<SVGUseElement>;

const genId = (): number => id++;

function createElement() {
  if (element || (element = document.getElementById(element_Id))) return element;
  element = document.createElement("div");
  element.id = element_Id;
  element.classList.add("sr-only");
  // element.style.display = "none";
  // element.style.width = "0";
  // element.style.height = "0";
  document.scrollingElement?.insertBefore(element, document.body);
  return element;
}

const onLoadSVG = (id: string, cb?: () => void) =>
  function onLoadSVG(this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
    const element = createElement();
    const x = document.createElement("x");
    this.onload = null;
    x.innerHTML = this.responseText;
    const svg: SVGElement | undefined = x.getElementsByTagName("svg")[0];
    if (svg) {
      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.overflow = "hidden";
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.id = id;
      element.insertBefore(svg, element.firstChild);
    }
    cb?.();
  };

function getBaseUrl(href?: string) {
  let url: string[];
  if (href && href.split) {
    url = href.split("#");
  } else {
    url = ["", ""];
  }
  const base = url[0];
  return base;
}

async function makeRequest(href?: string) {
  return new Promise<string>((resolve, reject) => {
    const base = getBaseUrl(href);
    let id = caches.get(base);
    if (!id) {
      id = ":" + genId();
      caches.set(base, id);
      const xhr = new XMLHttpRequest();
      xhr.onload = onLoadSVG(id, () => {
        resolve(id as string);
      });
      xhr.open("GET", base);
      xhr.onerror = reject;
      xhr.send();
      return;
    }
    return resolve(id as string);
  });
}
const caches: Map<string, string> = new Map();

const Use = (props: Props) => {
  const [id, setId] = useState<string | undefined>(() => {
    const base = getBaseUrl(props.href || props.xlinkHref);
    const existing = caches.get(base);
    return existing;
  });
  useEffect(() => {
    makeRequest(props.href || props.xlinkHref).then(setId);
  }, [props.href, props.xlinkHref]);

  return (
    <use
      {...props}
      href={props.href && id ? "#" + id : undefined}
      xlinkHref={props.xlinkHref && id ? "#" + id : undefined}
      data-link={props.href || props.xlinkHref}
    />
  );
};

export default Use;
