import { data, NavLink } from "react-router-dom";
import ChevronRight from "../assets/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAccountInfo } from "../redux/accountSlice";
import { formatDate } from "../assets/usables";
import DataLeftCircle from "../components/DataLeftCircles";
import axios from "axios";


const Dashboard = () => {
  const [accountInfo, setAccountInfoState] = useState(null);
  const [userPlanCount, setUserPlanCount] = useState(0);

  const dispatch = useDispatch();
  let accountDetails = useSelector((state) => state.account.info);





  useEffect(() => {

    if (!accountDetails) {
      const storedAccountInfo = localStorage.getItem("accountInfo");
      if (storedAccountInfo) {
        const parsedAccountInfo = JSON.parse(storedAccountInfo);
        setAccountInfoState(parsedAccountInfo); // ✅ Updates local state
        dispatch(setAccountInfo(parsedAccountInfo)); // ✅ Updates Redux
        console.log("Loaded account details from localStorage into Redux");
      }
    }
    else {
      setAccountInfoState(accountDetails);
    }
  }, [dispatch, accountDetails]);

  useEffect(() => {
    const fetchUserPlanCount = async () => {
      console.log("fetching plan count")
      try {
        const response = await axios.get("http://localhost:5000/api/proxies/get-plan-list");
        console.log(response,"response for plan count")
        if (response.data.success) {
          // Filter plans by user
          const userPlans = response.data.plans
          setUserPlanCount(userPlans.length); // ✅ Store count
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    
      fetchUserPlanCount();
    
  }, []);




  const totalData = accountDetails?.bandwidth || 1; // Default 1GB
  const dataLeft = accountDetails?.bandwidthLeft || 0;
  const dataLeftPercentage = Math.round((dataLeft / totalData) * 100);
  const strokeDasharray = 251.2; // Full circle
  const strokeDashoffset = strokeDasharray - (dataLeftPercentage / 100) * strokeDasharray;

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8">
      <h3 className="text-lg font-semibold">Welcome User</h3>
      <p className="text-gray-600">Welcome back, we are glad to have you here</p>


      <div className="grid gap-6 mt-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">

        <div className="p-4 bg-white shadow rounded-lg flex flex-col">
          <div className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg max-w-[50px]">
            <img
              src="https://lightningproxies.net/assets/images/icons/doller.svg"
              alt="dollar"
            />
          </div>
          <h3 className="text-gray-500 text-md mt-3">Active Balance</h3>
          <div className="flex justify-between">
            <p className="text-2xl font-bold mt-2">$10</p>
            <div>
              <button className=" py-1 px-4 bg-green-100 text-green-500 rounded-lg shadow flex items-center border border-green-500">
                Add Balance <ChevronRight />
              </button>
            </div>

          </div>

          <div className="border-b border-gray-200 my-3"></div>
          <p className="flex justify-between">
            Total Balance Spent <span>$50</span>
          </p>
        </div>

        {/* Active Plans Card */}
        <div className="p-4 bg-white shadow rounded-lg flex flex-col">
          <div className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg max-w-[50px]">
            <img
              src="https://lightningproxies.net/assets/images/icons/cart.svg"
              alt="plans"
            />
          </div>
          <h3 className="text-gray-500 text-md mt-3">Active Plans</h3>
          <div className="flex justify-between">
            <p className="text-2xl font-bold mt-2">1</p>
            <div>
              <NavLink to="/" >
                <button className=" py-1 px-4 bg-blue-100 text-blue-500 rounded-lg shadow flex items-center border border-blue-500">
                  Purchase Plan <ChevronRight />
                </button>
              </NavLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-3"></div>
          <p className="flex justify-between">
            Total Purchased Plans: <span className="">{userPlanCount || 1}</span>
          </p>
        </div>

        {/* Data Left Card */}
        <div className="p-4 bg-white shadow rounded-lg flex flex-col">
          <div className="flex justify-between">
            <div>
              <div className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg max-w-[50px]">
                <img
                  src="https://lightningproxies.net/assets/images/icons/server.svg"
                  alt="data"
                />
              </div>
              <h3 className="text-gray-500 text-md mt-3">Data Left</h3>
              <p className="text-2xl font-bold mt-2">{dataLeft}</p>
            </div>
            <div>
              <DataLeftCircle usedData={accountInfo?.bandwidth - accountInfo?.bandwidthLeft} totalData={accountInfo?.bandwidth} />
            </div>

          </div>
          <div className="border-b border-gray-200 my-3"></div>
          <p className="flex justify-between">
            Total Data Purchased <span>{accountInfo?.bandwidth || 0} GB</span>
          </p>
        </div>

        {/* User Card */}
        <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center">
          <div className="p-4 bg-blue-500 flex justify-center items-center shadow-md rounded-full max-w-[60px]">
            <img
              src="https://lightningproxies.net/assets/images/icons/user.svg"
              alt="user"
            />
          </div>
          <h3 className="text-black font-semibold text-lg mt-3">User</h3>
          <p className="text-gray-500 text-sm mt-1">{accountDetails?.user || "63c0f7cdc57f2549b45645tc"}</p>


          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {["g-01", "g-02", "g-03", "g-04"].map((icon, index) => (
              <div key={index} className="w-10 h-10">
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


      <div className="mt-8">
        <h3 className="text-lg font-semibold">Your Active Plans</h3>
        <p className="text-gray-600">Generate proxies with just a click of a button</p>


        <div className="mt-4 p-6 bg-white shadow rounded-lg flex flex-col w-full md:w-1/2">
          <div className="flex flex-wrap items-center space-x-4 w-full">
            <div className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-full w-12 h-12">
              <span className="text-white font-bold text-lg">{dataLeftPercentage}%</span>
            </div>

            <div className="flex lg:flex-row md:flex-row sm:flex-row justify-between flex-1">
              <div className="md:w-3/5">
                <h3 className="text-lg font-semibold">Residential {accountInfo?.bandwidth} GB</h3>
                <p className="text-gray-500 text-sm">
                  Ideal proxies for any use case & purpose. By accessing our 10M+ IP pool,
                  non-subnet linked, bans, and blocks are non-existent.
                </p>
              </div>
              <p className="text-bold text-xl mt-2 sm:mt-0 md:mt-0">{accountInfo?.bandwidth || 0}GB</p>
            </div>
          </div>

          <div className="border-b border-gray-200 my-3"></div>

          {/* 🔥 FIX: Adjusted layout for small screens */}
          <div className="flex flex-wrap gap-4 justify-between mt-4">
            <div>
              <p className="text-gray-500 text-sm">Plan ID:</p>
              <span className="font-bold">{accountInfo?.id}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Data Left:</p>
              <span className="font-bold">{accountInfo?.bandwidthLeft || 0} GB / {accountInfo?.bandwidth || 0} GB</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Expires:</p>
              <span className="font-bold">{accountInfo?.expiresAt && formatDate(accountInfo?.expiresAt) || 0}</span>
            </div>

            {/* 🔥 FIX: Made button full-width on small screens */}
            <NavLink to="/proxy-page" className="w-full md:w-auto">
              <button className="mt-4 py-2 px-4 bg-blue-100 text-blue-500 rounded-lg shadow flex items-center border border-blue-500 w-full md:w-auto">
                Generate Proxy <ChevronRight />
              </button>
            </NavLink>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Dashboard;






