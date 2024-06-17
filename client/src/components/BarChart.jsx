import { useState, useEffect ,useContext} from "react";
import Chart from "chart.js/auto";
import { MonthContext } from "../context/MonthContext";
import "./barchart.css";

const BarChart = () => {
  const [chartData, setChartData] = useState(null);
  const { selectedMonth ,setSelectedMonth} = useContext(MonthContext);

  const fetchBarChart = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      // Set an error state or display an error message to the user
    }
  };

  useEffect(() => {
    fetchBarChart(`/api/v1/barchart?month=${selectedMonth}`);
  }, [selectedMonth]);

  useEffect(() => {
    if (chartData) {
      renderChart();
    }
  }, [chartData]);

  const renderChart = () => {
    const ctx = document.getElementById('barChart').getContext('2d');
  
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }
  
    const { labels, counts } = chartData;
  
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Transaction',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Items',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Price Range',
            },
          },
        },
      },
    });
  };
  
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  return (
    <div className="container">
      <h1 className="barchart">Transactions Bar Chart</h1>
      <h1 className="h">
        Bar Chart Stats - (
        <label htmlFor="monthSelect" className="month">
        </label>
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
      <canvas id="barChart"></canvas>
    </div>
  );
};

export default BarChart;
