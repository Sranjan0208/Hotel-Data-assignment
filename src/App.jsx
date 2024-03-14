import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import "./App.css";

function App() {
  const [requests, setRequests] = useState([]);
  const [chartData, setChartData] = useState({});
  const [uniqueDepartments, setUniqueDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://checkinn.co/api/v1/int/requests"
        );
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const data = {};
    requests.forEach((request) => {
      if (data[request.hotel.name]) {
        data[request.hotel.name]++;
      } else {
        data[request.hotel.name] = 1;
      }
    });
    const chartData = {
      options: {
        chart: {
          id: "requests-chart",
        },
        xaxis: {
          categories: Object.keys(data),
        },
        yaxis: {
          min: 0,
          tickAmount: 5,
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
          },
        },
      },
      series: [
        {
          name: "Requests per Hotel",
          data: Object.values(data),
        },
      ],
    };
    setChartData(chartData);
  }, [requests]);

  useEffect(() => {
    const uniqueDepts = [
      ...new Set(requests.map((request) => request.desk.name)),
    ];
    setUniqueDepartments(uniqueDepts);
  }, [requests]);

  const totalRequests = requests.length;

  return (
    <div className="container">
      <div className="content">
        <h5>Requests per hotel</h5>
        {chartData.series && chartData.series.length > 0 && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            width="700"
          />
        )}
        <p>Total Requests: {totalRequests}</p>
        <p className="departments">
          List of unique department names across all Hotels:{" "}
          {uniqueDepartments.join(", ")}
        </p>
      </div>
    </div>
  );
}

export default App;
