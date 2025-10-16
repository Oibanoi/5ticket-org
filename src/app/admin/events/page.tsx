"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Input, Spin } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LogoWithoutText } from "shared/components/icon/logo";
import Svg from "shared/components/icon/svg";
import { raceStatusOption, raceTypeOption } from "features/event/const";
import contextMenu from "shared/components/context-menu";
import Breadcrumbs from "shared/components/breadcrumbs";
import PaginationSimple from "shared/components/pagination";
type RaceDetailList = {
  id: number;
  title: string;
  logo_url?: string;
  location?: string;
  ward?: string;
  district?: string;
  province?: string;
  prefix?: string;
  event_start_date?: string;
  race_type?: "run" | "night" | "fun" | string;
  status?: "published" | "draft" | "finished" | string;
};
const columnHelper = createColumnHelper<RaceDetailList>();
const race: {
  data: { list: RaceDetailList[]; totalPages: number; totalItems: number } | undefined;
  isFetching?: boolean;
} = {
  data: {
    list: [
      {
        id: 1,
        title: "Hanoi Marathon 2025",
        logo_url: "",
        location: "Hanoi",
        ward: "Cau Giay",
        district: "Cau Giay",
        province: "Ha Noi",
        prefix: "HN2025",
        event_start_date: dayjs().add(10, "day").toISOString(),
        race_type: "run",
        status: "published",
      },
      {
        id: 2,
        title: "Da Nang Night Run",
        logo_url: "",
        location: "Da Nang",
        ward: "",
        district: "Hai Chau",
        province: "Da Nang",
        prefix: "DN-NIGHT",
        event_start_date: dayjs().add(30, "day").toISOString(),
        race_type: "night",
        status: "draft",
      },
      {
        id: 3,
        title: "Ho Chi Minh City Charity Run",
        logo_url: "",
        location: "Ho Chi Minh City",
        ward: "District 1",
        district: "District 1",
        province: "Ho Chi Minh",
        prefix: "HCMC-CHAR",
        event_start_date: dayjs().subtract(5, "day").toISOString(),
        race_type: "fun",
        status: "finished",
      },
    ],
    totalPages: 1,
    totalItems: 3,
  },
  isFetching: false,
};
const columns = [
  columnHelper.accessor("title", {
    cell({ getValue, row }) {
      return (
        <div className="flex">
          <div className="w-16 h-16 mr-3 flex-shrink-0">
            {row.original.logo_url ? (
              <img
                key={`race_img_${row.id}`}
                src={row.original.logo_url || "/icon.svg"}
                alt={row.original.title}
                className="rounded-md w-full h-full bg-gray-300 center-by-grid text-center text-xs object-cover"
              />
            ) : (
              <div className="flex justify-center items-center h-full w-full bg-gray-300 rounded-md">
                <LogoWithoutText height={25} className="fill-secondary-600" />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <Link href={`/events/detail?id=${row.original.id}`}>
              <b>{getValue()}</b>
            </Link>
            <div className="text-xs flex gap-x-1 items-center">
              <Svg src="/icons/location.svg" width={16} height={16} />
              <p className="truncate">
                {[
                  row.original.location,
                  row.original.ward,
                  row.original.district,
                  row.original.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <p className="text-xs flex gap-x-1 items-center">
              <Svg src="/icons/code.svg" width={16} height={16} />
              {row.original.prefix}
            </p>
          </div>
        </div>
      );
    },
    meta: { className: "rounded-l-lg py-3 px-3 whitespace-nowrap bg-white w-full" },
  }),
  columnHelper.accessor("event_start_date", {
    cell: ({ getValue }) => <div className="text-sm">{dayjs(getValue()).format("DD/MM/YYYY")}</div>,
    meta: { className: "py-2 px-3 bg-white w-full xl:w-auto" },
  }),
  columnHelper.accessor("race_type", {
    cell: ({ getValue }) => {
      //   const raceConfig = raceTypeOption.byKey(getValue());
      return (
        <Button className="btn-xs font-bold border-2 rounded-full gap-x-2.5 whitespace-nowrap no-hover">
          {/* {raceConfig.message} */} Message
        </Button>
      );
    },
    meta: { className: "py-2 px-3 bg-white w-min" },
  }),
  columnHelper.accessor("status", {
    header: "Thao tác",
    cell: ({ getValue, row }) => {
      const { title, type } = { title: "Published", type: "success" };
      return (
        <div className="text-center flex">
          <Button
            className={clsx("btn-xs font-bold border-2 rounded-full whitespace-nowrap no-hover", {
              "text-success-400": type === "success",
              "text-blue-400": type === "info",
              "text-yellow-500": type === "warning",
              "text-gray-400": type === "idle",
            })}
          >
            {title}
          </Button>
          <Button
            className="md:hidden btn-xs rounded-full ml-2"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              //   contextMenu(e, row.original);
            }}
          >
            <FiMenu size={16} />
          </Button>
        </div>
      );
    },
    meta: { className: "py-2 px-3 bg-white rounded-r-lg w-min" },
  }),
];

export default function PageEvents() {
  //   const { t } = useTranslation("router");
  const [query, setQuery] = useState("");
  // const [status, setStatus] = useState<any>(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  //   const selected = useTenantStore((s) => s.selected)!;
  //   const queryClient = useQueryClient();

  //   const params = { tenant_id: selected.id, title: query };
  //   const searchParams = {
  //     ...params,
  //     status: status?.value,
  //     sortDirection: SortDirection.DESC,
  //     is_virtual: false,
  //   };

  //   const race = useQuery([Race.PLURAL, searchParams, pagination], () =>
  //     Race.list(searchParams, pagination)
  //   );
  const table = useReactTable({
    data: race.data?.list || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  //   const { data: isAdmin } = useQuery([Tenant.SINGULAR], () => Tenant.isAdmin());

  //   const title = t("events");

  return (
    <>
      {/* <ContextMenuEvent /> */}
      <Breadcrumbs
        pages={[
          { href: "/", title: "Trang chủ " },
          { href: "/events", title: "Quản lý sự kiện" },
        ]}
      />
      <section className="flex flex-wrap items-center whitespace-nowrap mt-4">
        <h1 className="font-semibold text-2xl mr-4 flex-1 ">Quản lý sự kiện</h1>
        <Button type="primary">
          <Link href="/events/create">
            {/* <Svg src="/icons/add.svg" width={16} height={16} /> */}+ Sự kiện
          </Link>
        </Button>

        {/* )} */}
      </section>

      <section className="pt-6">
        <div className="flex gap-4 overflow-auto">
          {[{ title: "Tất cả", value: null }, ...raceStatusOption.options].map((option) => (
            <button
              key={option.value}
              role="checkbox"
              type="button"
              className="aria-checked:text-secondary-600 aria-checked:border-current border-transparent border-b-2 font-bold text-gray-600 whitespace-nowrap"
              // aria-checked={option.value === status?.value}
              // onClick={() => setStatus(option)}
            >
              {option.title}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-md mt-4">
          <div className="flex gap-3">
            <Input />
            {/* <InputWithIcons
              clearable
              className="flex-1"
              trailing="/icons/search_shape.svg"
              placeholder="Mã sự kiện, mã code, tên sự kiện"
              value={query}
              onClear={() => setQuery("")}
              onClickTrailing={() => setQuery(query)}
              onSubmit={() => setQuery(query)}
              onChange={(e: any) => setQuery(e.target.value)}
            /> */}
            <Button onClick={() => setQuery("")} className="btn-xs bg-gray-200 font-bold text-sm">
              Đặt lại
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden xl:overflow-auto">
        {/* {race.isFetching && (
          <div className="absolute inset-0 center-by-grid bg-gradient-radial from-white to-transparent">
            <Spin />
          </div>
        )} */}
        <table className="block xl:table w-full mt-4 border-separate border-spacing-y-4 overflow-hidden">
          <tbody className="block xl:table-row-group space-y-4 xl:space-y-0 w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="rounded-xl flex flex-wrap bg-white xl:bg-transparent xl:table-row w-full xl:w-auto overflow-hidden truncate"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    // contextMenu(e, row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      {...cell.column.columnDef.meta}
                      //   className={clsx(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={999} className="py-5 text-center">
                  <i>Không có dữ liệu</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <PaginationSimple
          adjacent={1}
          onChange={table.setPageIndex}
          pageIndex={pagination.pageIndex}
          totalPage={race.data?.totalPages}
          pageSize={pagination.pageSize}
          totalItems={race.data?.totalItems}
        />
      </section>
    </>
  );
}
