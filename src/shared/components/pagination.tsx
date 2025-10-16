import clsx from "clsx";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import Svg from "./icon/svg";
import useControlled from "shared/hooks/useControlled";
import { calculatePaginations } from "shared/utilities/paging";

type Props = {
  totalPage?: number;
  pageIndex?: number;
  adjacent?: number;
  pageSize?: number;
  totalItems?: number;

  onChange?(pageIndex: number): void;
};

const PaginationSimple = ({
  totalPage = 1,
  pageIndex: pageProp,
  adjacent = 1,
  pageSize = 10,
  totalItems = 0,
  onChange,
}: Props) => {
  const [pageIndex, setPageIndex] = useControlled(pageProp, pageProp || 0, onChange);
  const pagi = useMemo(() => {
    return calculatePaginations(pageIndex, adjacent, totalPage);
  }, [adjacent, pageIndex, totalPage]);

  const handlePage: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const page = e.currentTarget.dataset.page;
      setPageIndex(Number(page) - 1);
    },
    [setPageIndex]
  );

  const handleNextPage = () => {
    if (pageIndex >= totalPage - 1) return;
    setPageIndex((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    if (pageIndex <= 0) return;
    setPageIndex((prev) => prev - 1);
  };
  const offset = pageIndex * pageSize;

  return (
    <div className="relative flex flex-wrap">
      <div className="w-1/3 hidden xl:block" />
      <div className="order-3 xl:order-2 flex justify-center items-center gap-2 md:gap-3 flex-wrap w-full xl:w-1/3">
        <button
          type="button"
          className="h-8 w-8 rounded-sm border box-border font-bold flex items-center justify-center text-secondary-800 disabled:opacity-25"
          onClick={handlePrevPage}
          disabled={!pagi.canPrevPage}
        >
          <Svg src="/icons/chevron-right.svg" width={20} height={20} className="rotate-180" />
        </button>
        {pagi.paginations.map((pagi, index) => {
          return (
            <Button
              activeClassName="bg-secondary-600 border-secondary-600 text-white"
              className="h-8 w-8 rounded-sm border box-border font-bold"
              idleClassName="border-neutral-300 text-sm"
              data-page={pagi.page}
              key={index}
              onClick={handlePage}
              isActive={pagi.active}
              disabled={typeof pagi.page === "string"}
            >
              {pagi.page}
            </Button>
          );
        })}

        <button
          type="button"
          className="h-8 w-8 rounded-sm border box-border font-bold flex items-center justify-center text-secondary-800 disabled:opacity-25"
          onClick={handleNextPage}
          disabled={!pagi.canNextPage}
        >
          <Svg src="/icons/chevron-right.svg" width={20} height={20} />
        </button>
      </div>
      {typeof totalItems === "number" ? (
        <div className="w-full order-2 xl:order-3 xl:w-1/3 xl:text-right text-sm">
          {offset + 1}-{Math.min(offset + pageSize, totalItems)} trong số {totalItems}
        </div>
      ) : null}
    </div>
  );
};

const Button = ({
  activeClassName,
  idleClassName,
  className,
  isActive,
  ...rest
}: PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    activeClassName?: string;
    idleClassName?: string;
    isActive?: boolean;
  }
>) => {
  return (
    <button {...rest} className={clsx(isActive ? activeClassName : idleClassName, className)} />
  );
};

export default PaginationSimple;
