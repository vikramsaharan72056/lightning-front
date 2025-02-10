import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAccountInfo } from "../redux/accountSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountInfo = useSelector((state) => state.account.info);
  const [planId, setPlanId] = useState("");

  const fetchData = async (planID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/proxies/create-account/${planID}`);
      const accountData = response.data.accountDetails;
  
      if (accountData) {
        const createdAt = new Date(); // Current date when plan is created
        const expiresAt = new Date(createdAt);
        expiresAt.setMonth(expiresAt.getMonth() + (accountData.duration || 3)); // Add duration in months
  
        const updatedAccountInfo = {
          ...accountData,
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };
  
        dispatch(setAccountInfo(updatedAccountInfo));
        localStorage.setItem("accountInfo", JSON.stringify(updatedAccountInfo));
        console.log("Saved updated account details to Redux & LocalStorage");
      }
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  const handlePurchase = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/proxies/get-residential-plan", { bandwidth: 1 });
      if (data.success) {
        setPlanId(data.planID);
        localStorage.setItem("planId", data.planID);
        fetchData(data.planID);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error getting residential plan:", error);
    }
  };

  useEffect(() => {
    const storedPlanId = localStorage.getItem("planId");
    if (storedPlanId && !accountInfo) {
      fetchData(storedPlanId);
    }
  }, [planId]);

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Checkout</h2>
      <p className="text-gray-600 mb-6">Proceed to pay from your selected plan</p>

      {/* Checkout Card */}
      <div className="max-w-md w-full p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-bold text-blue-600 text-center">Residential <span className="text-black">1GB</span></h3>
        <p className="text-gray-500 text-center mt-2 text-sm">
          Ideal proxies for any use case & purpose. By accessing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent.
        </p>

        <div className="mt-4 space-y-2 text-gray-600">
          <p><strong>Bandwidth:</strong> 1GB</p>
          <p><strong>Proxy Type:</strong>Residential</p>
          <p><strong>Duration:</strong> 3 Months</p>
          <p><strong>Threads:</strong> Unlimited</p>
        </div>

        {/* Coupon Code Input */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm">Coupon Code (Optional)</label>
          <div className="relative mt-2 w-full">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="w-full px-4 py-2 pr-16 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold hover:text-blue-700">
              APPLY
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-4 text-gray-700">
          <p><strong>Payment Method:</strong> <input type="radio" checked className="mr-2" /> Balance</p>
        </div>

        {/* Total and Pay Button */}
        <div className="mt-4 text-lg font-bold">
          <p>Total: <span className="text-blue-600">${accountInfo?.price || "4.50"}</span></p>
        </div>
        <button onClick={handlePurchase} className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Pay &gt;
        </button>
      </div>

      {/* Payment Methods */}
      <div className="flex justify-center mt-6 space-x-2 text-gray-600 w-[50%]">
        <img src="https://lightningproxies.net/assets/images/cryptoMus.svg" alt="Cryptomus" className="h-10" />
        <div className="border-1 border-r-gray-700 h-7 ml-3 mr-3 mt-2"></div>
        <img src="https://lightningproxies.net/assets/images/stripe_logo.svg" alt="Stripe" className="h-10" />
      </div>
    </div>
  );
};

export default Checkout;
