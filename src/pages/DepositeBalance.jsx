const DepositBalance = () => {
  return (
    <div className="flex flex-col items-center p-6 w-full">
      <h2 className="text-3xl font-bold mb-2 text-gray-600 text-center">Deposit Balance</h2>
      <p className="text-gray-600 mb-6 text-center">Add balance to your account using cryptocurrency</p>

      {/* Deposit Form */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-lg p-8 bg-white shadow rounded-lg">
          <label className="block text-gray-600 mb-2">Enter Top-up Amount</label>
          <input
            type="text"
            placeholder="$0.00"
            className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Action Buttons */}
          <button className="w-full mt-4 bg-green-500 text-white py-3 rounded hover:bg-green-600 transition">
            Add Balance using Cryptocurrency &gt;
          </button>
          <button className="w-full mt-2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
            Add Balance using Stripe &gt;
          </button>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center mt-6 items-center gap-4 text-gray-600">
          <img src="https://lightningproxies.net/assets/images/cryptoMus.svg" alt="Cryptomus" className="h-10" />
          <div className="h-7 w-[1px] bg-gray-500"></div>
          <img src="https://lightningproxies.net/assets/images/stripe_logo.svg" alt="Stripe" className="h-10" />
          <span className="text-sm bg-violet-600 px-2 py-1 rounded-full text-white flex items-center">+5%</span>
        </div>
      </div>
    </div>
  );
};

export default DepositBalance;
