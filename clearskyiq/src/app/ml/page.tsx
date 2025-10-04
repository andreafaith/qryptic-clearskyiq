"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ML() {
  const [viewMode, setViewMode] = useState("daily");
  const [timeRange, setTimeRange] = useState("48hrs");
  const [location, setLocation] = useState("Manila");
  const [forecastData, setForecastData] = useState([
    { time: "6AM", aqi: 50 },
    { time: "8AM", aqi: 70 },
    { time: "10AM", aqi: 90 },
    { time: "12PM", aqi: 110 },
    { time: "2PM", aqi: 130 },
    { time: "4PM", aqi: 150 },
    { time: "6PM", aqi: 170 },
  ]);

  const handleGetForecast = () => {
    // Example placeholder: Normally you'd fetch API data here
    alert("Fetching AQI forecast...");
  };

  return (
    <div className="min-h-screen bg-[var(--deep-blue)] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded-xl border ${
                viewMode === "daily"
                  ? "bg-white text-[var(--deep-blue)]"
                  : "border-white hover:bg-white/10"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode("hourly")}
              className={`px-4 py-2 rounded-xl border ${
                viewMode === "hourly"
                  ? "bg-white text-[var(--deep-blue)]"
                  : "border-white hover:bg-white/10"
              }`}
            >
              Hourly
            </button>
          </div>

          {/* Middle: Time Range */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTimeRange("48hrs")}
              className={`px-4 py-2 rounded-xl border ${
                timeRange === "48hrs"
                  ? "bg-white text-[var(--deep-blue)]"
                  : "border-white hover:bg-white/10"
              }`}
            >
              Next 48 hrs
            </button>
            <button
              onClick={() => setTimeRange("today")}
              className={`px-4 py-2 rounded-xl border ${
                timeRange === "today"
                  ? "bg-white text-[var(--deep-blue)]"
                  : "border-white hover:bg-white/10"
              }`}
            >
              Today
            </button>
          </div>

          {/* Right: Dropdown */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-[var(--blue-yonder)] border border-white rounded-xl px-4 py-2 outline-none"
          >
            <option>Manila</option>
            <option>Quezon City</option>
            <option>Cebu</option>
            <option>Davao</option>
          </select>
        </div>

        {/* CONCLUSION */}
        <div className="text-center border border-white/30 rounded-xl py-6">
          <h2 className="text-lg md:text-xl">
            <span className="font-semibold text-[var(--neon-yellow)]">
              Conclusion:
            </span>{" "}
            Tomorrow, <b>2PM</b> | AQI <b>142</b> (Unhealthy for Sensitive Groups)
          </h2>
        </div>

        {/* CHART SECTION */}
        <div className="bg-[var(--blue-yonder)] rounded-2xl p-6 shadow-lg relative">
          {forecastData && forecastData.length > 0 ? (
            <>
              <h3 className="text-center text-2xl font-semibold mb-6">
                Air Quality Index Forecast
              </h3>

              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                    <XAxis dataKey="time" stroke="#fff" />
                    <YAxis domain={[0, 200]} stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1f3b",
                        border: "1px solid #fff",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke="#f5d547"
                      strokeWidth={3}
                      dot={{ fill: "#fff", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <button
                onClick={handleGetForecast}
                className="bg-white text-[var(--deep-blue)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--neon-yellow)] transition"
              >
                Get Forecast
              </button>
            </div>
          )}
        </div>

        {/* COLOR INTENSITY LEGEND */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {[
            { color: "#00E400", label: "Good (0–50)" },
            { color: "#FFFF00", label: "Moderate (51–100)" },
            { color: "#FF7E00", label: "Unhealthy for Sensitive (101–150)" },
            { color: "#FF0000", label: "Unhealthy (151–200)" },
            { color: "#8F3F97", label: "Very Unhealthy (201–300)" },
            { color: "#7E0023", label: "Hazardous (301+)" },
          ].map((level, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: level.color }}
              ></div>
              <span className="text-sm">{level.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
