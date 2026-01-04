import { getTotalPages, updateSearchParams } from "@/helpers/helper";
import { Pagination } from "@heroui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  resPerPage: number;
  filteredCount: number;
}

const CustomPagination = ({ resPerPage, filteredCount }: Props) => {
  const router = useRouter();

  const totalPages = getTotalPages(filteredCount, resPerPage);

  const searchParams = useSearchParams(); //useSearchParams used to get the value not set the value

  const page = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    let queryParams = new URLSearchParams(searchParams.toString());
    queryParams = updateSearchParams(queryParams, "page", newPage.toString());

    const path = `${window.location.pathname}?${queryParams.toString()}`;
    router.push(path);
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <Pagination
        isCompact
        showControls
        showShadow
        initialPage={1}
        total={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default CustomPagination;
