const DepositBalance = () => {
  return (
    <div className="flex flex-col px-0 xl:px-10 2xl:px-14 w-full gap-6">
      <div className="max-w-[700px] w-full">
        <h2 className="text-2xl font-semibold mb-0 text-[#292742]">
          Deposit Balance
        </h2>
        <p className="text-[#292742] text-base m-0 mt-1">
          Add balance to your account using cryptocurrency
        </p>
      </div>
      {/* Deposit Form */}
      <div className="flex flex-col max-w-[700px] w-full gap-6">
        <div className="w-full p-5 md:p-7 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <label className="text-[#888] text-[15px] font-medium block mb-2">
            Enter Top-up Amount
          </label>
          <input
            type="number"
            placeholder="$0.00"
            className="w-full px-4 text-[#292742] font-medium text-base py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-xl"
          />

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col gap-2">
            <button className="w-full bg-[#2fb851] text-white text-base px-4 py-2.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-green-600 transition font-semibold rounded-xl">
              Add Balance using Cryptocurrency{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="#fff"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              </svg>
            </button>
            <button className="w-full bg-[#635bff] text-white text-base px-4 py-2.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-xl">
              Add Balance using Stripe{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="#fff"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center text-[#292742]">
          <img
            src="https://lightningproxies.net/assets/images/cryptoMus.svg"
            alt="Cryptomus"
            className="h-10"
          />
          <span className="ml-2.5">|</span>
          <div className="flex gap-2.5 items-center">
            <img
              src="https://lightningproxies.net/assets/images/stripe_logo.svg"
              alt="Stripe"
              className="h-12"
            />
            <span className="text-xs bg-[#625aff] px-2 py-1 rounded-full text-white font-semibold flex items-center">
              +5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositBalance;
