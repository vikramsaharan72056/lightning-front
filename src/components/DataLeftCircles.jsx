const DataLeftCircle = ({ usedData, totalData }) => {
    const percentageLeft = ((totalData - usedData) / totalData) * 100;
    const strokeDasharray = 251.2; // Full circumference of the circle
    const strokeDashoffset = ((100 - percentageLeft) / 100) * strokeDasharray; 
  
    return (
      <div className="relative flex justify-center">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-[#8bbaff]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-[#1675ff]"
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
          <div className="absolute inset-0 flex items-center justify-center flex-col text-[#292742] text-[15px] leading-[20px] font-bold m-0">
            {Math.round(percentageLeft)}%
            <span className="font-normal text-xs">Data left</span>
          </div>
        </div>
      </div>
    );
  };

  export default DataLeftCircle;