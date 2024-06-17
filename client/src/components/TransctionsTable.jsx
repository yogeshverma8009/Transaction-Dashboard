import { useEffect, useState,useContext } from "react";
import TransactionData from "./TransactionData";
import "./t.css";
import Statistics from "./Statistics";
import BarChart from "./BarChart";
import { MonthContext } from "../context/MonthContext";

const TransctionsTable = () => {
  const [transactiondata, setTransactionData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { selectedMonth, setSelectedMonth } = useContext(MonthContext);
  const [page, setPage] = useState(1);
  
  const perPage = 10;

  const fetchTransaction = async (url) => {
    try {
      const res = await fetch(url);

      const data = await res.json();
      if (data.length > 0) {
        setTransactionData(data);
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  useEffect(() => {
    fetchTransaction(
      `/api/v1/transactionall?searchText=${searchText}&month=${selectedMonth}&page=${page}&perPage=${perPage}`
    );
  }, [searchText, selectedMonth, page]);

  const handleNextPage = (e) => {
    e.preventDefault()
    if (page === 2){
      return;
    } 
      setPage(page + 1);
    
  };

  const handlePrevPage = (e) => {
    e.preventDefault()
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <div className="center">
        <h1 className="circle">Transaction Dashboard</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search Transaction"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="selectM">
        <label htmlFor="monthSelect" className="month">
          Select Month
        </label>
        <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>sold</th>
            <th>image</th>
          </tr>
        </thead>
        <tbody>
          <TransactionData tdata={transactiondata} />
        </tbody>
      </table>
      <div>
      <span className="page">Page: {page}</span>
      <button className="btl" onClick={handlePrevPage}>Previous</button>
      <button className="btr" onClick={handleNextPage} >Next</button>
        <span className="perPage"> Per Page: {perPage}</span>
      </div>
       <h1 style={{marginTop:100}}></h1>
     <Statistics/>
     <h1 style={{marginTop:100}}></h1>
     <BarChart/>
    </>
  );
};

export default TransctionsTable;
