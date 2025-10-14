"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { ChallengeRouters, EventRouters, Routers } from "../components/router";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Svg from "../components/icon/svg";
import {
  NavigationGroupType,
  NavigationItemType,
} from "../components/navigation";

// types
export interface SectionItem {
  title?: string;
  href?: string;
  [key: string]: unknown;
}
interface NavigationState {
  navigations: NavigationGroupType[];
  setNavigations(d: NavigationGroupType[]): void;
}
type StoreRootState = StoreApi<NavigationState>;
// Ent types

function createNavigationStore(navigations: NavigationGroupType[]) {
  return createStore<NavigationState>((set) => ({
    navigations,
    setNavigations: (navigations) => set(() => ({ navigations: navigations })),
  }));
}

type Nav = { title: string; links: NavigationGroupType["links"][0][] };
const VALIDS = ["banghuund99@gmail.com"];
// function isValidUser(user: Session | null) {
//   if (!user || !configs.IS_OWNER) return false;
//   return VALIDS.some((admin) => user.user.username === admin);
// }

const cacheCompare = new Map<string, Map<string, boolean>>();
function getCacheByName(name: string) {
  return cacheCompare.has(name)
    ? cacheCompare.get(name)!
    : cacheCompare.set(name, new Map()).get(name)!;
}
function show(pathname: string) {
  const cache = getCacheByName("events");
  const SUB_ROUTER_EVENT_DETAIL = Routers.EVENTS + "/[id]";
  if (cache.has(pathname)) return cache.get(pathname)!;
  cache.set(
    pathname,
    [SUB_ROUTER_EVENT_DETAIL, Routers.EVENTS + "/edit"].some((v) =>
      pathname.startsWith(v)
    )
  );
  return cache.get(pathname)!;
}

function showChanllenge(pathname: string) {
  const cache = getCacheByName("challenge");
  const SUB_ROUTER_EVENT_DETAIL = Routers.CHALLENGE + "/[id]";
  if (cache.has(pathname)) return cache.get(pathname)!;
  cache.set(
    pathname,
    [SUB_ROUTER_EVENT_DETAIL, Routers.CHALLENGE + "/edit"].some((v) =>
      pathname.startsWith(v)
    )
  );
  return cache.get(pathname)!;
}

const NavigationStoreContext = createContext<StoreRootState | undefined>(
  undefined
);

export function NavigationProvider(props: { children?: React.ReactNode }) {
  //   const { t } = useTranslation("router");
  //   const { t: tCommon } = useTranslation();
  //   const { data: user } = useSession();
  //   const { permissions } = useRole();
  const [store] = useState(() =>
    createNavigationStore([] as NavigationGroupType[])
  );
  const { setNavigations } = useStore(store);
  //   const { clear: clearTenant, selected } = useTenantStore((s) => s);
  //   const documents = useQuery(
  //     ["CUSTOM_ROUTER"],
  //     () =>
  //       axios
  //         .get<
  //           Response.Format<
  //             {
  //               _id: string;
  //               title: string;
  //               content: string;
  //               slug: string;
  //               published: number | null;
  //             }[]
  //           >
  //         >("/api/docs", { params: { published: 1 } })
  //         .then((d) => {
  //           if (!d.data.success) return [];
  //           return d.data.data.map((route) => ({
  //             title: route.title,
  //             href: Routers.DOCUMENTS + "/" + route.slug,
  //             isExact: true,
  //           }));
  //         }),
  //     { placeholderData: [] }
  //   );

  //   const { isSystemAdmin } = useRole();

  useEffect(() => {
    function checkLinkPermission(nav: NavigationItemType) {
      return true;
      //    nav.permission ? permissions.has(nav.permission) : true;
    }
    cacheCompare.clear();
    const isDeveloper = true; // isValidUser(user);

    const subNavs: NavigationItemType[] = [
      {
        icon: (
          <Svg
            src="/icons/solar/Time/Calendar Add.svg"
            width={16}
            height={16}
          />
        ),
        title: "Thêm sự kiện",
        href: Routers.EVENTS_CREATE,
        show,
        // permission: Permission.EventCreate,
      },
      {
        // icon: <BsPencilSquare />,
        icon: (
          <Svg
            src="/icons/solar/Notes/Document Add.svg"
            width={16}
            height={16}
          />
        ),
        title: "Cập nhật sự kiện",
        href: EventRouters.EDIT,
        params: true,
        show,
        // permission: Permission.EventUpdate,
      },
      {
        icon: (
          <Svg src="/icons/solar/Notes/Notebook.svg" width={16} height={16} />
        ),
        title: "Thông tin chi tiết",
        href: EventRouters.DETAIL,
        params: true,
        show,
        // permission: Permission.EventDetail,
      },
      {
        icon: (
          <Svg src="/icons/solar/Money/Bill List.svg" width={16} height={16} />
        ),
        title: "Quản lý đơn hàng",
        href: EventRouters.ORDER,
        params: true,
        show,
        // permission: Permission.OrderList,
      },
      {
        icon: <Svg src="/icons/gmail_groups.svg" width={16} height={16} />,
        title: "Danh sách nhóm",
        params: true,
        show,
        // permission: Permission.GroupList,
        href: EventRouters.GROUP,
      },
      {
        icon: (
          <Svg src="/icons/solar/Sports/Swimming.svg" width={16} height={16} />
        ),
        title: "Danh sách VDV",
        href: EventRouters.ATHLETE,
        params: true,
        show,
        // permission: Permission.AthelteList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Money/Ticket Sale.svg"
            width={16}
            height={16}
          />
        ),
        title: "Mã giảm giá",
        href: EventRouters.VOUCHER,
        params: true,
        show,
        // permission: Permission.PromotionList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Users/Users Group Two Rounded.svg"
            width={16}
            height={16}
          />
        ),
        title: "Nhân sự phụ trách",
        href: EventRouters.STAFF,
        params: true,
        show,
        // permission: Permission.SeasonalPersonnelList,
      },
      {
        icon: (
          <Svg src="/icons/bi_ticket-perforated.svg" width={16} height={16} />
        ),
        title: "Danh sách vé",
        href: EventRouters.TICKET,
        params: true,
        show,
        // permission: Permission.TicketList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Notes/Clipboard List.svg"
            width={16}
            height={16}
          />
        ),
        title: "Yêu cầu cần xử lý",
        href: EventRouters.REPORT,
        params: true,
        show,
        // permission: Permission.RequestList,
      },
    ].filter(checkLinkPermission);

    const subNavsWithoutUpdate: NavigationItemType[] = [
      // {
      //   icon: <Svg src="/icons/solar/Notes/Notebook.svg" width={16} height={16} />,
      //   title: "Thông tin chi tiết",
      //   href: EventRouters.DETAIL,
      //   params: true,
      //   show,
      //   permission: Permission.EventDetail,
      // },
      {
        icon: (
          <Svg src="/icons/solar/Money/Bill List.svg" width={16} height={16} />
        ),
        title: "Quản lý đơn hàng",
        href: EventRouters.ORDER,
        params: true,
        show,
        // permission: Permission.OrderList,
      },
      {
        icon: <Svg src="/icons/gmail_groups.svg" width={16} height={16} />,
        title: "Danh sách nhóm",
        params: true,
        show,
        // permission: Permission.GroupList,
        href: EventRouters.GROUP,
      },
      {
        icon: (
          <Svg src="/icons/solar/Sports/Swimming.svg" width={16} height={16} />
        ),
        title: "Danh sách VDV",
        href: EventRouters.ATHLETE,
        params: true,
        show,
        // permission: Permission.AthelteList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Money/Ticket Sale.svg"
            width={16}
            height={16}
          />
        ),
        title: "Mã giảm giá",
        href: EventRouters.VOUCHER,
        params: true,
        show,
        // permission: Permission.PromotionList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Users/Users Group Two Rounded.svg"
            width={16}
            height={16}
          />
        ),
        title: "Nhân sự phụ trách",
        href: EventRouters.STAFF,
        params: true,
        show,
        // permission: Permission.SeasonalPersonnelList,
      },
      {
        icon: (
          <Svg src="/icons/bi_ticket-perforated.svg" width={16} height={16} />
        ),
        title: "Danh sách vé",
        href: EventRouters.TICKET,
        params: true,
        show,
        // permission: Permission.TicketList,
      },
      {
        icon: (
          <Svg
            src="/icons/solar/Notes/Clipboard List.svg"
            width={16}
            height={16}
          />
        ),
        title: "Yêu cầu cần xử lý",
        href: EventRouters.REPORT,
        params: true,
        show,
        // permission: Permission.RequestList,
      },
    ].filter(checkLinkPermission);

    const subNavsofChallenge: NavigationItemType[] = [
      {
        icon: (
          <Svg src="/icons/solar/Notes/Notebook.svg" width={16} height={16} />
        ),
        title: "Thêm thử thách",
        href: ChallengeRouters.CREATE,
        params: true,
        showChanllenge,
        // permission: Permission.ChallengeCreate,
      },
      {
        icon: (
          <Svg src="/icons/solar/Notes/Notebook.svg" width={16} height={16} />
        ),
        title: "Cập nhật thử thách",
        href: ChallengeRouters.EDIT,
        params: true,
        showChanllenge,
        // permission: Permission.ChallengeUpdate,
      },
    ].filter(checkLinkPermission);

    // const documentations: NavigationItemType[] = documents.data
    //   ? [...documents.data]
    //   : [];
    const configLinks: NavigationItemType[] = [
      // {
      //   title: "Cấu hình",
      //   href: Routers.CONFIGS,
      // },
      //   {
      //     title: selected ? "Chọn tenant (" + selected.name + ")" : "Chọn tenant",
      //     href: "#config",
      //     onClick: clearTenant,
      //   },
      //   {
      //     title: "Lịch sử phiên bản",
      //     onClick() {
      //       const event = new Event("keydown");
      //       Object.assign(event, { key: "k", ctrlKey: true });
      //       window.dispatchEvent(event);
      //     },
      //     href: "#version",
      //   },
    ];
    // if (isDeveloper) {
    //   configLinks.push({
    //     title: "Xoá cache trên trang web",
    //     onClick() {
    //       confirm("Xác nhận xoá", () => {
    //         const path = prompt("Nhập đường dẫn");
    //         if (path)
    //           return fetch("https://race.5bib.com/api/revalidate?path=" + path)
    //             .then((d) => d.json())
    //             .then((response) =>
    //               response.success
    //                 ? alert("Xoá thành công")
    //                 : alert("Xoá thất bại")
    //             );
    //       });
    //     },
    //     href: "#",
    //   });
    // }

    if (isDeveloper) {
      //   documentations.push(
      //     { title: "Thêm mới", href: "/admin/documentation/new", isExact: true },
      //     { title: "Danh sách", href: "/admin/documentation/list", isExact: true }
      //   );
      configLinks.push(
        { title: "Test", href: "/admin/test" },
        { title: "Icon", href: "/admin/icons" }
      );
    }

    const navigation: Nav[] = [
      {
        title: "Doanh nghiệp",
        links: [
          {
            title: "Trang chủ",
            href: Routers.HOME,
            matchPath: true,
            isExact: true,
          },
          {
            title: "Sự kiện",
            // permission: Permission.EventList,
            href: Routers.EVENTS,
            isExact: true,
            // links: isSystemAdmin === false ? subNavsWithoutUpdate : subNavs,
          },
          // {
          //   title: "Quản lý thử thách",
          //   permission: Permission.ChallengeList,
          //   href: Routers.CHALLENGE,
          //   isExact: true,
          //   links: subNavsofChallenge,
          // },
          // { title: t("orders"), permission: Permission.RootOrderList, href: Routers.ORDERS },
          {
            title: "Nhân sự",
            // permission: Permission.PersonnelList,
            href: Routers.EMPLOYEES,
          },
          {
            title: "Event kit tools",
            // permission: Permission.Racekit,
            href: Routers.TOOLS,
            isExact: true,
          },
          {
            title: "Volunteer tools",
            // permission: Permission.Toolkit,
            href: Routers.VOLUNTEER,
            isExact: true,
          },
          {
            title: "Đối soát",
            // permission: Permission.OtherList,
            href: Routers.RECONCILIATION,
            isExact: true,
          },
        ].filter(checkLinkPermission),
      },
      // { title: "Tài liệu", links: documentations },
      { title: "Cài đặt", links: configLinks },
    ];
    // console.log("change");
    setNavigations(navigation);
  }, [
    // documents.data,
    setNavigations,
    // user,
    // clearTenant,
    // selected,
    // permissions,
    // t,
    // tCommon,
    // isSystemAdmin,
  ]);

  return (
    <NavigationStoreContext.Provider value={store}>
      {props.children}
    </NavigationStoreContext.Provider>
  );
}
export function useNavigationStore<T = unknown>(
  selector: (s: NavigationState) => T
) {
  const store = useContext(NavigationStoreContext);
  if (!store)
    throw new Error(
      "useNavigationStore must be used within NavigationProvider"
    );
  return useStore(store, selector);
}
