import { NavLink } from "react-router-dom";

const PurchasePlan = () => {
  return (
    <div className="p-6">
      <div className="flex flex-row justify-end gap-4">
        <div className="flex flex-col gap-3 mr-[30%]">
          <div className="  py-2 px-3  rounded-lg  border-1 border-gray-300 ">
            <button className="px-4 py-2    rounded bg-blue-500 text-white transition">
              Residential
            </button>
          </div>

          <div className="  py-2 px-3  rounded-lg  border-1 border-gray-300 ">
            <button className="px-4 py-2    rounded bg-blue-500 text-white transition">
              Bandwidth
            </button>
          </div>
        </div>
      </div>

      {/* Plan Selection Buttons */}


      {/* Plan Details Card */}
      <div className="max-w-md p-6 bg-white shadow rounded-lg mt-10 ">
        <h3 className="text-xl font-bold text-blue-600">Residential <span className="text-black">1GB</span></h3>
        <p className="text-gray-500 text-lg font-bold mt-2">$4.50</p>
        <p className="text-gray-500 mt-2">Ideal proxies for any use case & purpose. By accessing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent.</p>

        <ul className="mt-4 space-y-2 text-gray-600">
          <li>✔ 10M+ Real Residential Peers</li>
          <li>✔ IP & User-Pass Authentication</li>
          <li>✔ Country, State, City & ISP Targeting</li>
          <li>✔ Rotating & Sticky Sessions</li>
          <li>✔ Unlimited Concurrent Connections</li>
          <li>✔ HTTP/SOCKS5 Protocol Supported</li>
        </ul>
        <NavLink to="/checkout">
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Purchase Plan
          </button>
        </NavLink>
        <p className="text-xs text-gray-500 mt-2 text-center">Terms & conditions apply</p>
      </div>
    </div>
  );
};

export default PurchasePlan;
