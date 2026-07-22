import { useCallback } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

import { PAGE_SIZE } from "../../constants";
import { Header } from "../Header";
import { Content } from "../Content";

export const AppRoutes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  const handleSearch = useCallback(
    (nextName: string) => {
      setSearchParams(nextName ? { name: nextName, page: "1" } : {});
    },
    [setSearchParams],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setSearchParams(
        name ? { name, page: String(nextPage) } : { page: String(nextPage) },
      );
    },
    [name, setSearchParams],
  );

  return (
    <>
      <Header initialSearch={name} onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Content
              name={name}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          }
        />
      </Routes>
    </>
  );
};
