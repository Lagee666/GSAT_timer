import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function DateSelector() {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selectedDate) {
      navigate(`/countdown?date=${selectedDate.toISOString()}`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-2xl mb-4">出生日期</h1>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          minDate={new Date("1970-01-01")}
          className="p-2 border rounded w-64 text-center"
          placeholderText="年/月/日"
          showYearDropdown // 啟用年份下拉選單
          showMonthDropdown // 啟用月份下拉選單
        />
        <button
          onClick={handleConfirm}
          disabled={!selectedDate}
          className="mt-4 bg-blue-500 text-white p-2 rounded w-64 disabled:bg-gray-400"
        >
          確定
        </button>
      </div>
    </div>
  );
}

export default DateSelector;
