const DataLeftCircle = ({ usedData, totalData }) => {
    const percentageLeft = ((totalData - usedData) / totalData) * 100;
    const strokeDasharray = 251.2; // Full circumference of the circle
    const strokeDashoffset = ((100 - percentageLeft) / 100) * strokeDasharray; 
  
    return (
      <div className="relative mt-3 flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-500"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold flex-col text-sm">
            {Math.round(percentageLeft)}%
          </div>
        </div>
      </div>
    );
  };

  export default DataLeftCircle;