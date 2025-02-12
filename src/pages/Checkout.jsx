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
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (planID) => {
    try {
      const response = await axios.get(
        `https://lightning-backend.onrender.com/api/proxies/create-account/${planID}`
      );
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
    }finally{
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://lightning-backend.onrender.com/api/proxies/get-residential-plan",
        { bandwidth: 1 }
      );
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
    <div className="flex flex-col px-0 xl:px-10 2xl:px-14 w-full gap-6">
      <div className="max-w-[500px] w-full mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-0 text-[#292742]">Checkout</h2>
        <p className="text-[#292742] text-base m-0 mt-1">
          Proceed to pay from your selected plan
        </p>
      </div>
      {/* Checkout Card */}
      <div className="flex flex-col max-w-[500px] mx-auto w-full gap-6">
      <div className="w-full p-5 md:p-7 bg-white border border-solid border-[#eaeaeb] rounded-xl md:pt-5">
      <h3 className="text-2xl font-semibold mb-0 text-[#292742] text-center  border-b border-solid border-b-[#c5e3ff] pb-3">Residential <span className="text-[#1675ff] font-bold">1GB</span></h3>
        <p className=" text-center text-[#888] text-sm font-normal block border-b border-solid border-b-[#c5e3ff] py-3">
          Ideal proxies for any use case & purpose. By accessing our 10M+ IP
          pool non-subnet linked, bans and blocks are non-existent.
        </p>

        <div className="py-5 flex flex-col gap-2.5 text-gray-600">
          <p className="flex gap-1 items-center justify-between text-[#292742] text-base font-semibold">
            <span className="text-[#888]">Bandwidth:</span> 1GB
          </p>
          <p className="flex gap-1 items-center justify-between text-[#292742] text-base font-semibold">
            <span className="text-[#888]">Proxy Type:</span>Residential
          </p>
          <p className="flex gap-1 items-center justify-between text-[#292742] text-base font-semibold">
            <span className="text-[#888]">Duration:</span> 3 Months
          </p>
          <p className="flex gap-1 items-center justify-between text-[#292742] text-base font-semibold">
            <span className="text-[#888]">Threads:</span> Unlimited
          </p>
        </div>

        {/* Coupon Code Input */}
        <div className="py-2">
          <label className="text-[#888] text-[15px] font-medium block mb-2">
            Coupon Code (Optional)
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="w-full px-4 text-[#292742] font-medium text-base py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-xl pr-20"
            />
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-[#1675ff] text-base px-4 py-2.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:text-blue-700 transition font-semibold rounded-xl">
              APPLY
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="py-5 text-gray-700">
          <p className=" font-semibold mb-0 text-[#292742] text-base flex items-center gap-2">
            Payment Method:
            <span className="text-lg"><input type="radio" checked className="mr-1.5" name="Method" id="Balance" /><label for="Balance">Balance</label></span>
          </p>
        </div>

        {/* Total and Pay Button */}
        <div className="flex items-center gap-3 justify-between border-t border-solid border-t-[#c5e3ff] pt-5">
          <p className=" font-semibold mb-0 text-[#292742] text-base flex items-center gap-2">
            Total:{" "}
            <span className="text-blue-600 text-[22px] font-bold">
              $<b className="text-[#292742] font-bold">{accountInfo?.price || "4.50"}</b>
              </span>
          </p>
          <button
  onClick={handlePurchase}
  disabled={isLoading}
  className={`w-full bg-[#1675ff] text-white text-base px-4 py-2.5 max-w-[250px] cursor-pointer flex justify-center text-center items-center gap-2 hover:bg-blue-700 transition font-semibold rounded-xl ${
    isLoading ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Processing...
    </span>
  ) : (
    <>
      Pay <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-4 w-4" fill="#fff"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
    </>
  )}
</button>

        </div>
      </div>

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
          </div>
        </div>
        </div>
    </div>
  );
};

export default Checkout;
