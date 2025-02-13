import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAccountInfo } from "../redux/accountSlice";
import { formatDate } from "../assets/usables";
import DataLeftCircle from "../components/DataLeftCircles";
import axios from "axios";

const Dashboard = () => {
  const [accountInfo, setAccountInfoState] = useState(null);
  const [userPlanCount, setUserPlanCount] = useState(0);
  const [plans, setPlans] = useState([]);

  const dispatch = useDispatch();
  let accountDetails = useSelector((state) => state.account.info);
  let totalDataPurchased = plans?.reduce((sum, plan) => sum + plan.bandwidth, 0);

  let totalBandwidthLeft = plans?.reduce((sum, plan) => sum + plan.bandwidthLeft, 0);
  

  useEffect(() => {
    if (!accountDetails) {
      const storedAccountInfo = localStorage.getItem("accountInfo");
      if (storedAccountInfo) {
        const parsedAccountInfo = JSON.parse(storedAccountInfo);
        setAccountInfoState(parsedAccountInfo); 
        dispatch(setAccountInfo(parsedAccountInfo)); 
        
      }
    } else {
      setAccountInfoState(accountDetails);
    }
  }, [dispatch, accountDetails]);

  useEffect(() => {
    const fetchUserPlanCount = async () => {
      
      try {
        const response = await axios.get(
          "https://lightning-backend.onrender.com/api/proxies/get-plan-list"
        );
        if (response.data.success) {
          // Filter plans by user
          const userPlans = response.data.plans;
          setUserPlanCount(userPlans.length);
          setPlans(response.data.plans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchUserPlanCount();
  }, []);

  

  
  
  

  return (
    <main className="px-0 xl:px-10 2xl:px-14 w-full">
      <div className="w-full mb-7 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-2xl font-semibold mb-0 text-[#292742]">
            Welcome User
          </h3>
          <p className="text-[#292742] text-base m-0 mt-1">
            Welcome back, we are glad to have you here
          </p>
        </div>
        <button className="text-[#292742] text-base px-4 py-3 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:text-[#292742] transition font-normal  bg-white border border-solid border-[#eaeaeb] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="h-4 w-4 rotate-45 mr-2"
            fill="#292742"
          >
            <path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3L32 352c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 384l64 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96z" />
          </svg>{" "}
          Please read!{" "}
          <span className="font-semibold flex items-center gap-0.5">
            Read More{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="h-3 w-3"
              fill="#292742"
            >
              <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
            </svg>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-5">
        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
            <img
              src="https://lightningproxies.net/assets/images/icons/doller.svg"
              alt="dollar"
            />
          </div>

          <div className="py-4">
          <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">
                Active Balance
              </h3>
            <div className="flex justify-between gap-2.5  items-center ">
              
              <p className="text-[#292742] text-[22px] font-bold m-0">$10</p>
              <button className="bg-[#eaf8ed] w-max border border-solid border-[#2fb851] text-[#2fb851] text-sm px-2 py-0.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-[#eaf8ed] transition font-semibold rounded-lg">
              Add Balance
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-3 w-3"
                fill="#2fb851"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              </svg>
            </button>
            </div>
            
          </div>

          <p className="flex justify-between border-t border-t-solid border-[#c5e3ff] pt-3 text-[#292742] text-[15px] font-bold">
            Total Balance Spent <span>$50</span>
          </p>
        </div>
        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
          <img
          src="https://lightningproxies.net/assets/images/icons/cart.svg"
          alt="plans"
        />
          </div>

          <div className="py-4">
          <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">
              Active Plans
              </h3>
            <div  className="flex justify-between gap-2.5  items-center ">
              
              <p className="text-[#292742] text-[22px] font-bold m-0">1</p>
              <button className="bg-[#e5f3ff] w-max border border-solid border-[#1675ff] text-[#1675ff] text-sm px-2 py-0.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-[#e5f3ff] transition font-semibold rounded-lg">
            Purchase Plan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-3 w-3"
                fill="#1675ff"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              </svg>
            </button>
            </div>
            
          </div>

          <p className="flex justify-between border-t border-t-solid border-[#c5e3ff] pt-3 text-[#292742] text-[15px] font-bold">
          Total Purchased Plans: <span>{userPlanCount || 1}</span>
          </p>
        </div>
        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <div className="flex justify-between">
            <div>
              <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
                <img
                  src="https://lightningproxies.net/assets/images/icons/server.svg"
                  alt="data"
                />
              </div>
              <div className="py-4">
              <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">Data Left</h3>
            <div className="flex justify-between gap-2.5  items-center ">
              
              <p className="text-[#292742] text-[22px] font-bold m-0">{totalBandwidthLeft?.toFixed(2)}GB</p>
              </div>
              </div>
            </div>
            <div>
              <DataLeftCircle usedData={totalDataPurchased - totalBandwidthLeft} totalData={totalDataPurchased} />
            </div>

          </div>
          <p className="flex justify-between border-t border-t-solid border-[#c5e3ff] pt-3 text-[#292742] text-[15px] font-bold">
            Total Data Purchased <span>{totalDataPurchased || 0} GB</span>
          </p>
        </div>
        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl text-center">
          <div className="p-4 bg-blue-500 flex justify-center items-center shadow-md rounded-full h-16 w-16 mx-auto mb-3">
            <img
              src="https://lightningproxies.net/assets/images/icons/user.svg"
              alt="user"
            />
          </div>
          <h3 className="text-[#292742] text-base leading-[20px] font-bold m-0">User</h3>
          <p className="text-[#292742] text-base leading-[20px] font-normal m-0">{accountDetails?.user || "63c0f7cdc57f2549b45645tc"}</p>


          <div className="flex gap-3 mt-4 flex-wrap justify-center items-center">
            {["g-01", "g-02", "g-03", "g-04"].map((icon, index) => (
              <div key={index} className="w-9 h-9">
                <img
                  src={`https://lightningproxies.net/assets/images/icons/${icon}.svg`}
                  alt={icon}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full mb-7">
          <h3 className="text-2xl font-semibold mb-0 text-[#292742]">
            Your Active Plans
          </h3>
          <p className="text-[#292742] text-base m-0 mt-1">
            Generate proxies with just a click of a button
          </p>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
          {plans?.map((plan, index) => (
            <div
              key={index}
              className="w-full p-5 bg-white border border-solid border-[#eaeaeb] rounded-xl flex flex-col"
            >
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-5 w-full pb-5 border-b border-b-solid border-[#c5e3ff]">
               
                <DataLeftCircle usedData={plan?.bandwidthLeft} totalData={plan.bandwidth} />

                <div className="flex lg:flex-row md:flex-row sm:flex-row justify-between flex-1 gap-2">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold mb-0 text-[#292742]">
                      Residential {Math.round(plan?.bandwidth)} GB
                    </h3>
                    <p className="text-[#888] text-sm font-normal block mt-1">
                      Ideal proxies for any use case & purpose. By accessing our
                      10M+ IP pool, non-subnet linked, bans, and blocks are
                      non-existent.
                    </p>
                  </div>
                  <p className="text-lg font-semibold mb-0 text-[#292742]">
                    {Math.round(plan?.bandwidth) || 0}GB
                  </p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-13 gap-2 pt-5 items-start">
                <div className="col-span-1 sm:col-span-4">
                  <p className="text-[#292742] text-sm font-normal">
                    Plan ID:
                  </p>
                  <span className="text-[#292742] text-sm font-bold break-anywhere">
                    {plan?.id}
                  </span>
                </div>
                <div className="col-span-1 lg:col-span-2">
                  <p className="text-[#292742] text-sm font-normal">
                    Data Left:
                  </p>
                  <span className="text-[#292742] text-sm font-bold">
                    {Math.round(plan?.bandwidthLeft) || 0} GB /{" "}
                    {Math.round(plan?.bandwidth) || 0} GB
                  </span>
                </div>
                <div className="col-span-1 lg:col-span-3">
                  <p className="text-[#292742] text-sm font-normal">
                    Expires:
                  </p>
                  <span className="text-[#292742] text-sm  font-bold">
                    {(accountInfo?.expiresAt &&
                      formatDate(accountInfo?.expiresAt)) ||
                      0}
                  </span>
                </div>

               
                <div className="col-span-1 lg:col-span-4">
                  <NavLink
                    to={{
                      pathname: "/proxy-page",
                    }}
                    state={{ plan }}
                    className="bg-[#e5f3ff] w-max border border-solid border-[#1675ff] text-[#1675ff] text-[15px] px-2.5 py-1.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-[#e5f3ff] transition font-semibold rounded-lg"
                  >
                    Generate Proxy
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      className="h-3 w-3"
                      fill="#1675ff"
                    >
                      <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                    </svg>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
