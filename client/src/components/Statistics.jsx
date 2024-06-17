import { useState, useEffect,useContext } from "react";
import { MonthContext } from "../context/MonthContext";
import "./s.css";

const Statistics = () => {
  const { selectedMonth ,setSelectedMonth} = useContext(MonthContext);
  const [statistics, setStatistics] = useState(null);

  const fetchStatistics = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();

      setStatistics(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStatistics(`/api/v1/statistics?month=${selectedMonth}`);
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  return (
    <>
      <div className="containe">
        <h1 className="statistics">Transctions Statistics</h1>
        <h1 className="h">
          Statistics - ( <label htmlFor="monthSelect" className="month"></label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          )
        </h1>

        {statistics && (
          <div className="stactis">
            <div>
              Total Amount of Sale: {statistics.totalSaleAmount[0].total}{" "}
            </div>
            <div>Total Sold Items: {statistics.totalSoldItems}</div>
            <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Statistics;
