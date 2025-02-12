import { useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setAccountInfo } from "../redux/accountSlice";
import { formatDate, formatTime } from "../assets/usables";
import DataLeftCircle from "../components/DataLeftCircles";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";


const ProxyComponent = () => {
  const accountDetails = useSelector((state) => state.account.info);
  const location = useLocation();
  const plan = location.state?.plan;
  const [activeTab, setActiveTab] = useState("auth");
  const [accountInfo, setAccountInfoState] = useState(null);

  const [stickySession, setStickySession] = useState(1);

  const [sessionToken, setSessionToken] = useState("");
  const [sessionTime, setSessionTime] = useState(0);

  const [gigabytesToAdd, setGigabytesToAdd] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [username, setUsername] = useState(plan?.user || "");
  const [password, setPassword] = useState(plan?.pass || "");

  const [proxyString, setProxyString] = useState("");
  const [proxyList, setProxyList] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [bandwidthData, setBandwidthData] = useState(null);

  const dispatch = useDispatch();
  

  useEffect(() => {
    if (!accountDetails) {
      const storedAccountInfo = localStorage.getItem("accountInfo");
      if (storedAccountInfo) {
        const parsedAccountInfo = JSON.parse(storedAccountInfo);
        setAccountInfoState(parsedAccountInfo); // ✅ Updates local state
        dispatch(setAccountInfo(parsedAccountInfo)); // ✅ Updates Redux
      }
    }
  }, [dispatch, accountDetails]);

 

  const generateProxy = useCallback(() => {
    if (!username || !password || !plan?.id) return; // Ensure required fields exist

    const host = "resi-ww.lightningproxies.net"; // Static Host
    const port = "9999"; // Static Port
    const zone = "zone-resi"; // Static Zone
    const sessionId = Math.random().toString(36).substring(2, 10); // Random session ID
    const formattedSessionTime = `sessTime-${sessionTime}`;


    const locationString = [
      selectedCountry ? `country-${selectedCountry}` : null,
      selectedState ? `state-${selectedState}` : null,
      selectedCity ? `city-${selectedCity}` : null,
    ]
      .filter(Boolean)
      .join("-");
    let rotatingProxy = `${host}:${port}:${username}-${zone}-${password}`
    if (selectedCountry) {
      rotatingProxy = `${host}:${port}:${username}-${zone}-region-${selectedCountry}`
      if(selectedState) {
        rotatingProxy = `${host}:${port}:${username}-${zone}-region-${selectedCountry}-st-${selectedState}`
        if(selectedCity){
          rotatingProxy = `${host}:${port}:${username}-${zone}-region-${selectedCountry}-st-${selectedState}-city-${selectedCity}`
        }
      }
    }
    // const rotatingProxy = `${host}:${port}:${username}-${zone}-${locationString}-session-${sessionId}-${formattedSessionTime}:${password}`;

    const proxyEntry = `${host}:${port}:${username}-${zone}-${locationString}-session-${sessionId}:${password}`;

    setProxyString(rotatingProxy);
    setProxyList((prev) => [...prev, proxyEntry]); // ✅ Use function form to avoid unnecessary dependencies
    localStorage.setItem(
      `proxyList-${plan.id}`,
      JSON.stringify([...proxyList, proxyEntry])
    );
    localStorage.setItem(`proxyString-${plan.id}`, rotatingProxy);
  }, [
    username,
    password,
    plan?.id,
    selectedCountry,
    selectedState,
    selectedCity,
    sessionTime,
    sessionToken,
  ]);

  useEffect(() => {

    if (accountDetails) {
      setAccountInfoState(accountDetails);
      const fetchCountries = async () => {
        try {
          const response = await axios.post(
            "https://lightning-backend.onrender.com/api/proxies/get-country-list"
          );
          if (response.data.success) {
            setCountries(response.data.countries);
          }
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };
      fetchCountries();
    }
  }, [accountDetails]);

  useEffect(() => {
    if (selectedCountry) {
      const fetchStates = async () => {
        try {
          const response = await axios.post(
            "https://lightning-backend.onrender.com/api/proxies/get-state-list",
            {
              country_code: selectedCountry,
            }
          );
          if (response.data.success) {
            setStates(response.data.states);
            setCities([]);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const fetchCities = async () => {
        try {
          const response = await axios.post(
            "https://lightning-backend.onrender.com/api/proxies/get-city-list",
            {
              country_code: selectedCountry,
              state: selectedState,
            }
          );
          if (response.data.success) {
            setCities(response.data.cities);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    }
  }, [selectedState]);

  const handleAddGigabytes = async () => {
    if (!accountDetails?.id || gigabytesToAdd <= 0) {
      alert("Invalid plan ID or gigabyte amount.");
      return;
    }

    try {
      const response = await axios.post(
        "https://lightning-backend.onrender.com/api/proxies/modify-gigabytes",
        {
          action: "add",
          planId: accountDetails.id,
          gigabytes: gigabytesToAdd,
        }
      );

      if (response.data.success) {
        alert("Gigabytes added successfully!");
        
        setGigabytesToAdd(0);


        const updatedBandwidthLeft = response.data.data.Remaining;


        const updatedAccountInfo = {
          ...accountDetails,
          bandwidth: accountDetails.bandwidth + gigabytesToAdd, // Add the requested GB
          bandwidthLeft: updatedBandwidthLeft, // Update with API response value
        };


        dispatch(setAccountInfo(updatedAccountInfo));


        localStorage.setItem("accountInfo", JSON.stringify(updatedAccountInfo));


        setAccountInfoState(updatedAccountInfo);
      } else {
        alert("Failed to add gigabytes.");
      }
    } catch (error) {
      console.error("Error adding gigabytes:", error);
      alert("Error adding gigabytes.");
    }
  };

  useEffect(() => {
    const storedProxies =
      JSON.parse(localStorage.getItem(`proxyList-${plan.id}`)) || [];
    const rotatingProxy = localStorage.getItem(`proxyString-${plan.id}`);
    setProxyString(rotatingProxy);
    setProxyList(storedProxies);
  }, [plan?.id, accountDetails]);



  
  

  useEffect(() => {
    const socket = io("http://localhost:5000/"); // Connect to WebSocket
  
    // Listen for real-time updates
    socket.on("data-update", (data) => {
      console.log("📡 Received real-time bandwidth update:", data);
  
      if (data && data.plans) {
        const filteredPlans = data.plans.filter((plan) => plan.user === username);
        console.log("got data")
        setBandwidthData({ ...data, plans: filteredPlans });
      }
    });
  
    // Cleanup WebSocket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, [username]);
  

  return (
    <main className="px-0 xl:px-10 2xl:px-14">

      <div className="w-full mb-7 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-2xl font-semibold mb-0 text-[#292742]">
            Generate Proxy
          </h3>
          <p className="text-[#292742] text-base m-0 mt-1">
            Plan ID: {plan?.id}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <p className="text-[#292742] text-base font-medium m-0">
            Need Support ?
          </p>
          <button className="bg-[#1675ff] text-white text-base px-4 py-2.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-xl">
            Contact Us{" "}
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

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <div className="flex justify-between gap-2.5  items-start ">
            <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
              <img
                src="https://lightningproxies.net/assets/images/icons/qube.svg"
                alt="calendar"
              />
            </div>
            <button className="bg-[#e5f3ff] w-max border border-solid border-[#1675ff] text-[#1675ff] text-sm px-2 py-0.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-[#e5f3ff] transition font-semibold rounded-lg">
              Plan Settings
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

          <div className="pt-4">
            <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">
              Current Plan
            </h3>
            <p className="text-[#292742] text-xl font-semibold m-0">
              Residential {plan?.bandwidth} GB
            </p>
          </div>
        </div>

        <div className="p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl">
          <div className="flex justify-between gap-2.5  items-start ">
            <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
              <img
                src="https://lightningproxies.net/assets/images/icons/date-w.svg"
                alt="calendar"
              />
            </div>
            <button className="bg-[#e5f3ff] w-max border border-solid border-[#1675ff] text-[#1675ff] text-sm px-2 py-0.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-[#e5f3ff] transition font-semibold rounded-lg">
              Auto Renew
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

          <div className="pt-4">
            <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">
              Plan Expiry
            </h3>
            <p className="text-[#292742] text-xl font-semibold m-0">
              {accountInfo ? formatDate(accountInfo?.expiresAt) : null}
            </p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 p-6 pb-5 bg-white border border-solid border-[#eaeaeb] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="w-full  border-b md:border-b-0 md:border-r border-[#c5e3ff] pb-4 md:pb-0 md:pr-4 flex flex-col sm:items-start">


            <div className="p-2 bg-blue-500 flex justify-center items-center shadow rounded-lg w-13 h-13">
              <img
                src="https://lightningproxies.net/assets/images/icons/quee.svg"
                alt="calendar"
              />
            </div>

            <div className="pt-4">
              <h3 className="text-[#292742] text-base leading-[20px] font-normal m-0">
                Total Bandwidth
              </h3>
              <p className="text-[#292742] text-xl font-semibold m-0">
                {Math.round(plan?.bandwidth)} GB
              </p>
            </div>
          </div>
          <div class="col-span-1 md:col-span-2 flex items-center gap-3 flex-wrap md:flex-nowrap ">
            <DataLeftCircle
              usedData={(plan?.bandwidthLeft).toFixed(2)}
              totalData={(plan?.bandwidth).toFixed(2)}
            />

            <div className="w-full">
              <div className="flex flex-col justify-between gap-2 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between items-center flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-[#8bbaff] rounded-full"></span>
                      <p className="text-[#888] text-sm font-normal block">
                        Used Bandwidth:
                      </p>
                    </div>
                    <p className="text-[#292742] text-sm font-bold block mt-1">
                      {(
                        bandwidthData?.plans[0].bandwidth -
                        bandwidthData?.plans[0].bandwidthLeft
                      )?.toFixed(2) || (accountInfo?.bandwidth - accountInfo.bandwidthLeft)}{" "}
                      GB
                    </p>
                  </div>

                  <div className="flex justify-between items-center flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-[#1675ff] rounded-full"></span>
                      <p className="text-[#888] text-sm font-normal block">
                        Remaining Bandwidth:
                      </p>
                    </div>
                    <p className="text-[#292742] text-sm font-bold block">
                      {bandwidthData?.plans[0]?.bandwidthLeft?.toFixed(2) || accountInfo?.bandwidthLeft} GB
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1 lg:ml-5">
                  <div className="flex flex-col w-full">
                    <label className="text-[#292742] text-sm font-medium block mb-1">
                      Add Bandwidth
                    </label>
                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                      <div className="relative max-w-[180px] w-full">
                        <input
                          type="number"
                          placeholder="0"
                          min={1}
                          value={gigabytesToAdd === 0 ? "" : gigabytesToAdd} // ✅ Prevents 0 from sticking
                          onChange={(e) => {
                            const val = e.target.value;
                            setGigabytesToAdd(
                              val === "" ? "" : Math.max(1, parseInt(val))
                            );
                          }}
                          className="w-full px-2.5 h-[32px] text-[#292742] font-medium text-sm py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-md"
                        />
                        <span className="absolute right-2 top-[5px] text-[#1675ff] text-sm font-medium">GB</span>
                      </div>
                      <button
                        onClick={handleAddGigabytes}
                        className="bg-[#1675ff] text-white text-sm px-3 py-1 h-[32px] cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-md"
                      >
                        Add
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                          className="h-3 w-3"
                          fill="#fff"
                        >
                          <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="w-full mb-7">
          <h3 className="text-2xl font-semibold mb-0 text-[#292742]">
            Configure Proxy
          </h3>
          <p className="text-[#292742] text-base m-0 mt-1">
            Configure your proxy type, and whitelist IP
          </p>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6  items-start">
          <div className="p-0 bg-white border border-solid border-[#eaeaeb] rounded-xl">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-3 pt-3 border-b border-b-solid border-b-[#eaeaeb]">



              <div className="flex">
                <button
                  className={`p-2 px-4 text-[15px] cursor-pointer font-medium border-b-2  ${activeTab === "auth"
                    ? " border-[#1675ff] text-[#292742]"
                    : "text-[#888] border-transparent"
                    }`}
                  onClick={() => setActiveTab("auth")}
                >
                  User Auth & Pass
                </button>
                <button
                  className={`p-2 px-4 text-[15px] cursor-pointer font-medium border-b-2 ${activeTab === "whitelist"
                    ? " border-[#1675ff]  text-[#292742]"
                    : "text-[#888] border-transparent"
                    }`}
                  onClick={() => setActiveTab("whitelist")}
                >
                  Whitelist IP
                </button>
              </div>
              <div className="flex justify-end gap-4 px-5 sm:pl-0 sm:pr-3">
                <span className="text-sm flex items-center">
                  <input type="radio" checked className="mr-1.5" name="Proxy" id="Stander" /><label for="Stander">Stander</label></span>
                <span className="text-sm flex items-center">
                  <input type="radio" className="mr-1.5" name="Proxy" id="Regions" /><label for="Regions">Regions</label></span>
              </div>
            </div>
            <div className="p-6 py-4 pb-14">

              {activeTab === "auth" ? (
                <div className="flex flex-col gap-5">
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                    <div className="flex flex-col w-full">
                      <label className="text-[#888] text-sm font-medium block mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter username"
                        className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[#888] text-sm font-medium block mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        placeholder="Enter password"
                        className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="hidden sm:block"></div>
                    <button className="bg-[#1675ff] text-white text-[15px] px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg">
                      Country-State-City
                    </button>
                  </div>




                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                    <div className="flex flex-col w-full">
                      <label className="text-[#888] text-sm font-medium block mb-1">
                        Country
                      </label>
                      <select
                        className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                        value={selectedCountry}
                        onChange={(e) => { setSelectedCountry(e.target.value)
                        }}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option
                            key={country.country_code}
                            value={country.country_code}
                          >
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[#888] text-sm font-medium block mb-1">
                        State
                      </label>
                      <select
                        className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        disabled={!selectedCountry}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-[#888] text-sm font-medium block mb-1">
                        City
                      </label>
                      <select
                        className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                        disabled={!selectedState}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.code} value={city.code}>
                            {city.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>


                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button className="bg-[#1675ff] text-white text-[15px] px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg">
                      API Generator
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="h-4 w-4" fill="#fff"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>
                    </button>
                    <button
                      onClick={generateProxy}
                      className="bg-[#1675ff] text-white text-[15px] px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg"
                    >
                      Update Settings
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="h-4 w-4" fill="#fff"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="">
                  <input
                    type="text"
                    placeholder="Enter IP Address"
                    className="w-full px-4 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                  />
                  <button className="mt-3 bg-[#1675ff] text-white text-[15px] px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg">
                    Add IP
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-0 bg-white border border-solid border-[#eaeaeb] rounded-xl">
            <h6 className="text-[#292742] text-base font-medium block m-0 p-6 py-4 border-b border-b-solid border-b-[#eaeaeb]">
              Proxy
            </h6>
            <div className=" p-6 py-4">

              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col w-full">
                  <label className="text-[#888] text-sm font-medium block mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    placeholder="resi-eu.lightningproxies.net"
                    className="w-full px-2.5 text-[#292742] font-medium text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-[#888] text-sm font-medium block mb-1">
                    Port (HTTP & SOCKS)
                  </label>
                  <input
                    type="text"
                    placeholder="9999"
                    className="w-full px-2.5 text-[#292742] font-medium text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                  />
                </div>


                <div className="flex flex-col w-full col-span-1 sm:col-span-2">
                  <label className="text-[#888] text-sm font-medium block mb-1">
                    Rotating Proxy
                  </label>
                  <input
                    type="text"
                    placeholder={
                      proxyString || ""
                    }
                    className="w-full px-2.5 text-[#292742] font-medium text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                  />
                </div>

                <div className="border-1 border-solid border-[#eaeaeb] bg-[#fafafa] rounded-lg p-4 pt-5 col-span-1 sm:col-span-2">
                  <span className="w-2/3">
                    <label className="text-[#292742] text-[15px] font-medium block mb-2.5">
                      Sticky Sessions (Session time: {formatTime(sessionTime)} min)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={stickySession}
                      onChange={(e) => setStickySession(e.target.value)}
                      className="w-full"
                    />
                  </span>
                </div>
                <div className="col-span-1 sm:col-span-2 flex gap-2 items-center">
                  <label className="text-[#292742] text-[15px] font-medium block">Sticky count:</label>
                  <input
                    type="number"
                    value="2000"
                    className="px-4 max-w-24 text-[#292742] font-medium text-[15px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg"
                  />
                </div>


                <textarea
                  className="w-full col-span-1 sm:col-span-2 px-4 text-[#292742] font-medium text-sm py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-solid border-[#eaeaeb] rounded-lg custom-scrollbar"
                  style={{ whiteSpace: "pre-wrap" }}
                  readOnly
                  value={
                    proxyList.length > 0
                      ? proxyList.join("\n")
                      : "No proxies stored."
                  }
                />
              </div>




              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                <button className="bg-transparent text-[#1675ff] text-base p-2 cursor-pointer flex justify-center text-center items-center gap-1 transition font-semibold rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#1675ff" className="h-4 w-4"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg> Save as .txt
                </button>
                <button className="bg-[#1675ff] text-white text-base px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-xl">
                  Copy Proxies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProxyComponent;
