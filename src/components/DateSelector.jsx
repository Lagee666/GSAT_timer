import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function DateSelector() {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selectedDate) {
      navigate(`/countdown?date=${selectedDate.toISOString().split("T")[0]}`);
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
          className="p-2 border rounded w-64 text-center"
          placeholderText="年/月/日"
          showMonthDropdown // 啟用月份下拉選單
          showYearDropdown // 啟用年份下拉選單
          scrollableYearDropdown // 啟用年份下拉選單的滾動效果
          yearDropdownItemNumber={100}
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
