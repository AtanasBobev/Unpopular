import React from "react";
import Search from "../search";
import Box from "@material-ui/core/Box";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const [center, setCenter] = React.useState();
  const [zoom, setZoom] = React.useState();
  const [view, setView] = React.useState(1);
  const [searchQueryLength, setSearchQueryLength] = React.useState(0);
  const [queryData, setQueryData] = React.useState([]);
  const [searchQueryLimit, setSearchQueryLimit] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [prevSearchQuery, setPrevSearchQuery] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(1);
  const [searchPrice, setSearchPrice] = React.useState(1);
  const [searchDangerous, setSearchDangerous] = React.useState(1);
  const [searchAccessibility, setSearchAccessibility] = React.useState(1);
  const [searchShowFilters, searchSetShowFilters] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(1);
  return (
    <Search
      admin={true}
      center={center}
      setCenter={setCenter}
      zoom={zoom}
      setZoom={setZoom}
      searchQueryLimit={searchQueryLimit}
      setSearchQueryLimit={setSearchQueryLimit}
      searchQueryDataLength={searchQueryLength}
      setSearchQueryDataLength={setSearchQueryLength}
      toast={toast}
      prevSearchQuery={prevSearchQuery}
      setPrevSearchQuery={setPrevSearchQuery}
      searchLoading={searchLoading}
      setSearchLoading={setSearchLoading}
      queryData={queryData}
      setQueryData={setQueryData}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchShowFilters={searchShowFilters}
      searchSetShowFilters={searchSetShowFilters}
      searchCity={searchCity}
      setSearchCity={setSearchCity}
      searchCategory={searchCategory}
      setSearchCategory={setSearchCategory}
      searchPrice={searchPrice}
      setSearchPrice={setSearchPrice}
      searchDangerous={searchDangerous}
      setSearchDangerous={setSearchDangerous}
      searchAccessibility={searchAccessibility}
      setSearchAccessibility={setSearchAccessibility}
    />
  );
};
export default Dashboard;
