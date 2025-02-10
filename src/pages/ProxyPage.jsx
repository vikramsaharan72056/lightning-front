import { useState, useEffect } from "react";
import ChevronRight from "../assets/icons";
import { useSelector, useDispatch } from "react-redux";
import { setAccountInfo } from "../redux/accountSlice";
import { formatDate } from "../assets/usables";
import DataLeftCircle from "../components/DataLeftCircles";
import axios from "axios";

const ProxyComponent = () => {
    const accountDetails = useSelector((state) => state.account.info);
    const [activeTab, setActiveTab] = useState("auth");
    const [accountInfo, setAccountInfoState] = useState(null);
    const [stickyCount, setStickyCount] = useState(2000);
    const [stickySession, setStickySession] = useState(1);
    const [superSticky, setSuperSticky] = useState(false);
    const [gigabytesToAdd, setGigabytesToAdd] = useState(0);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [username, setUsername] = useState(accountDetails?.user || "");
    const [password, setPassword] = useState(accountDetails?.pass || "");
    const [updateStatus, setUpdateStatus] = useState(null);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const dispatch = useDispatch();
   


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
    }, [dispatch, accountDetails]);
    useEffect(() => {
        if (accountDetails) {
            setAccountInfoState(accountDetails);
            const fetchCountries = async () => {
                try {
                    const response = await axios.post("http://localhost:5000/api/proxies/get-country-list");
                    if (response.data.success) {
                        setCountries(response.data.countries);
                    }
                } catch (error) {
                    console.error("Error fetching countries:", error);
                }
            };
            fetchCountries();
        }
    }, []);
    console.log(accountInfo, "accountInfo");
    console.log(accountInfo?.expiresAt, "ExpiryDate")

    useEffect(() => {
        if (selectedCountry) {
            const fetchStates = async () => {
                try {
                    const response = await axios.post("http://localhost:5000/api/proxies/get-state-list", {
                        country_code: selectedCountry
                    });
                    if (response.data.success) {
                        setStates(response.data.states);
                        setCities([]); // Reset cities when country changes
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
                    const response = await axios.post("http://localhost:5000/api/proxies/get-city-list", {
                        country_code: selectedCountry,
                        state: selectedState
                    });
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
            const response = await axios.post("http://localhost:5000/api/proxies/modify-gigabytes", {
                action: "add",
                planId: accountDetails.id,
                gigabytes: gigabytesToAdd
            });

            if (response.data.success) {
                alert("Gigabytes added successfully!");
                console.log(response.data, "response for adding GB");
                setGigabytesToAdd(0);

                // ✅ Extract 'Remaining' correctly from response
                const updatedBandwidthLeft = response.data.data.Remaining;

                // ✅ Create updated object
                const updatedAccountInfo = {
                    ...accountDetails,
                    bandwidth: accountDetails.bandwidth + gigabytesToAdd,  // Add the requested GB
                    bandwidthLeft: updatedBandwidthLeft  // Update with API response value
                };

                // ✅ Update Redux Store
                dispatch(setAccountInfo(updatedAccountInfo));

                // ✅ Save to LocalStorage
                localStorage.setItem("accountInfo", JSON.stringify(updatedAccountInfo));

                // ✅ Update Local State
                setAccountInfoState(updatedAccountInfo);
            } else {
                alert("Failed to add gigabytes.");
            }
        } catch (error) {
            console.error("Error adding gigabytes:", error);
            alert("Error adding gigabytes.");
        }
    };


    const handleUpdateUser = async () => {
        if (!accountDetails?.id || !username || !password) {
            alert("Please provide a valid username and password.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/proxies/update-user/${accountDetails.id}`,
                {
                    planType: "residential",
                    username,
                    password,
                    proxyType: null
                }
            );

            if (response.data.success) {
                setUpdateStatus("User updated successfully!");
                alert("User updated successfully!");

                // ✅ Update local state and Redux
                const updatedAccountInfo = { ...accountDetails, user: username, pass: password };
                dispatch(setAccountInfo(updatedAccountInfo));
                localStorage.setItem("accountInfo", JSON.stringify(updatedAccountInfo));
            } else {
                setUpdateStatus("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setUpdateStatus("Error updating user.");
        }
    };





    return (
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Generate Proxy</h2>
                    <h3 className="text-gray-500 text-md">
                        Plan ID: {accountInfo?.id}
                    </h3>
                </div>
                <div className="flex items-center justify-end gap-1">
                    <p>Need Support ?</p>
                    <button className="py-2 px-3 bg-blue-500 text-white rounded-lg shadow flex items-center gap-1">
                        Contact Us <ChevronRight />
                    </button>
                </div>

            </div>

            {/* 🔹 Top Section: Two Small Cards (50%) + One Large Bandwidth Card (50%) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Two Small Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Plan */}
                    <div className="p-4 bg-white shadow rounded-lg  ">
                        <div className="flex justify-between">
                            <img
                                src="https://lightningproxies.net/assets/images/icons/qube.svg"
                                alt="calendar"
                                className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg w-12 h-12"
                            />
                            <div>
                                <a href="#" className="px-2 py-1 bg-blue-100 text-blue-500 rounded-lg border border-blue-500 flex items-center">
                                    Plan Settings <ChevronRight />
                                </a>
                            </div>



                        </div>
                        <span className="inline-block mt-4">
                            <p className="text-gray-500 text-sm mt-2">Current Plan</p>
                            <p className="text-xl font-bold">Residential {accountInfo?.bandwidth} GB</p>
                        </span>


                    </div>

                    {/* Plan Expiry */}
                    <div className="p-4 bg-white shadow rounded-lg  ">
                        <div className="flex justify-between">
                            <img
                                src="https://lightningproxies.net/assets/images/icons/date-w.svg"
                                alt="calendar"
                                className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg w-12 h-12"
                            />
                            <div>
                                <a href="#" className="px-2 py-1 bg-blue-100 text-blue-500 rounded-lg border border-blue-500 flex items-center">
                                    Auto Renew <ChevronRight />
                                </a>
                            </div>



                        </div>
                        <span className="inline-block mt-4">
                            <p className="text-gray-500 text-sm mt-2">Plan Expiry</p>
                            <p className="text-xl font-bold">{accountInfo ? formatDate(accountInfo?.expiresAt) : null}</p>
                        </span>


                    </div>

                </div>

                {/* Right: Bandwidth Usage (Takes Full Right Half) */}
                <div className="p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row justify-start gap-4 sm:gap-6">
                    {/* ✅ Left Section - Total Bandwidth */}
                    <div className="w-full sm:w-3/12 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4 flex flex-col items-center sm:items-start">
                        <img
                            src="https://lightningproxies.net/assets/images/icons/quee.svg"
                            alt="calendar"
                            className="p-3 bg-blue-500 flex justify-center items-center shadow rounded-lg w-12 h-12"
                        />
                        <span className="inline-block mt-4 text-center sm:text-left">
                            <p className="text-gray-500 text-sm mt-2">Total Bandwidth</p>
                            <p className="text-xl font-bold">{accountInfo?.bandwidth} GB</p>
                        </span>
                    </div>

                    {/* ✅ Center Section - Data Circle */}
                    <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                        <DataLeftCircle usedData={accountInfo?.bandwidthLeft} totalData={accountInfo?.bandwidth} />
                    </div>

                    {/* ✅ Right Section - Used & Remaining Bandwidth + Add Bandwidth */}
                    <div className="w-full sm:w-7/12">
                        <div className="flex flex-col justify-between gap-2 w-full">
                            <div className="space-y-2">
                                {/* ✅ Used Bandwidth */}
                                <div className="flex justify-between items-center flex-wrap">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                        <p className="text-gray-500 text-sm sm:text-xs">Used Bandwidth:</p>
                                    </div>
                                    <p className="text-sm sm:text-xs">{accountInfo?.bandwidth - accountInfo?.bandwidthLeft} GB</p>
                                </div>

                                {/* ✅ Remaining Bandwidth */}
                                <div className="flex justify-between items-center flex-wrap">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                                        <p className="text-gray-500 text-sm sm:text-xs">Remaining Bandwidth:</p>
                                    </div>
                                    <p className="text-sm sm:text-xs">{accountInfo?.bandwidthLeft} GB</p>
                                </div>
                            </div>

                            {/* ✅ Add Bandwidth Section */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 lg:ml-5">
                                <div className="flex flex-col w-full">
                                    <label className="text-gray-500 text-sm sm:text-xs">Add Bandwidth</label>
                                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            min={1}
                                            value={gigabytesToAdd === 0 ? "" : gigabytesToAdd} // ✅ Prevents 0 from sticking
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setGigabytesToAdd(val === "" ? "" : Math.max(1, parseInt(val))); // ✅ Ensures min value is 1
                                            }}
                                            className="w-full border px-2 py-1 rounded-lg text-sm sm:text-xs"
                                        />

                                        <button
                                            onClick={handleAddGigabytes}
                                            className="py-1 px-3 bg-blue-500 text-white rounded-lg shadow flex items-center"
                                        >
                                            <span className="flex items-center gap-1">
                                                <p className="text-sm sm:text-xs">Add</p>
                                                <ChevronRight />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 🔹 Second Section: Configure Proxy & Proxy (Each Takes 50%) */}
            <div className="flex flex-col mt-10">
                <div>
                    <h3 className="text-lg font-semibold">Configure Proxy</h3>
                    <p className="text-gray-600 mb-4">
                        Configure your proxy type, and whitelist IP
                    </p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mt-8 w-full">
                {/* ✅ Configure Proxy Section */}
                <div className="p-6 bg-white shadow rounded-lg w-full sm:w-1/2">
                    {/* ✅ Tabs Section */}
                    <div className="flex justify-end gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <p className="text-gray-500 text-sm sm:text-xs">Standard</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                            <p className="text-gray-500 text-sm sm:text-xs">Regions</p>
                        </div>
                    </div>

                    {/* ✅ Tab Navigation */}
                    <div className="flex border-b">
                        <button
                            className={`p-2 text-sm font-semibold ${activeTab === "auth" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("auth")}
                        >
                            User Auth & Pass
                        </button>
                        <button
                            className={`p-2 text-sm font-semibold ml-4 ${activeTab === "whitelist" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("whitelist")}
                        >
                            Whitelist IP
                        </button>
                    </div>

                    {/* ✅ Tab Content */}
                    {activeTab === "auth" ? (
                        <div className="flex flex-col gap-6 mt-4">
                            <div className="flex flex-col gap-4">
                            
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex flex-col w-full">
                                        <label className="text-gray-500 text-sm sm:text-xs">Username</label>
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            className="border p-2 rounded-lg text-sm sm:text-xs"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="text-gray-500 text-sm sm:text-xs">Password</label>
                                        <input
                                            type="text"
                                            placeholder="Enter password"
                                            className="border p-2 rounded-lg text-sm sm:text-xs"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* ✅ Country-State-City Button */}
                                <div className="flex justify-end">
                                    <button className="py-2 px-4 bg-blue-500 text-white lg:px-27 rounded-lg shadow">Country-State-City</button>
                                </div>
                            </div>

                            {/* ✅ Location Fields */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex flex-col w-full">
                                    <label className="text-gray-500 text-sm sm:text-xs">Country</label>
                                    <select
                                        className="w-full border p-1 rounded-lg"
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.country_code} value={country.country_code}>
                                                {country.country_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-gray-500 text-sm sm:text-xs">State</label>
                                    <select
                                        className="w-full border p-1 rounded-lg"
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
                                    <label className="text-gray-500 text-sm sm:text-xs">City</label>
                                    <select
                                        className="w-full border p-1 rounded-lg"
                                        disabled={!selectedState}
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

                            {/* ✅ Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                                <button className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow flex justify-between items-center">
                                    <p className="text-sm sm:text-xs">API Generator</p>
                                    <ChevronRight />
                                </button>
                                <button className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow flex justify-between items-center">
                                    <p className="text-sm sm:text-xs">Update Settings</p>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <input type="text" placeholder="Enter IP Address" className="w-full border p-2 rounded-lg text-sm sm:text-xs" />
                            <button className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow mt-2 text-sm sm:text-xs">Add IP</button>
                        </div>
                    )}
                </div>

                {/* ✅ Proxy Settings Section */}
                <div className="p-6 bg-white shadow rounded-lg w-full sm:w-1/2 flex flex-col gap-6">
                    <div className="flex border-b">
                        <button className="p-2 text-sm font-semibold text-gray-500">Proxy</button>
                    </div>

                    {/* ✅ Proxy Fields */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 text-sm sm:text-xs">Host</label>
                                <input type="text" placeholder="resi-eu.lightningproxies.net" className="border p-2 rounded-lg text-sm sm:text-xs" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 text-sm sm:text-xs">Port (HTTP & SOCKS)</label>
                                <input type="text" placeholder="9999" className="border p-2 rounded-lg text-sm sm:text-xs" />
                            </div>
                        </div>

                        {/* ✅ Rotating Proxy (ADDED) */}
                        <div className="flex flex-col w-full">
                            <label className="text-gray-500 text-sm sm:text-xs">Rotating Proxy</label>
                            <input type="text" placeholder="resi-rotating.lightningproxies.net" className="border p-2 rounded-lg text-sm sm:text-xs" />
                        </div>
                    </div>

                    {/* ✅ Sticky Sessions */}
                    <div className="flex justify-between border-1 bg-gray-200 rounded-lg p-4 gap-4">
                        <span className="w-2/3">
                            <label className="text-gray-600 text-sm flex items-center">
                                Sticky Sessions (Session time: {stickySession} min)
                                <span className="ml-2 text-blue-500">ℹ</span>
                            </label>
                            <input type="range" min="1" max="60" value={stickySession} onChange={(e) => setStickySession(e.target.value)} className="w-full" />
                        </span>

                        <label className="ml-4 flex w-1/3 items-center">
                            <span className="mr-1 text-sm">Activate Super Sticky</span>
                            <input type="checkbox" checked={superSticky} onChange={() => setSuperSticky(!superSticky)} className="toggle-checkbox" />
                        </label>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-gray-600 text-sm mr-2">Proxy Format Settings:</span>
                            <span className="text-blue-500 cursor-pointer">🎵</span>
                        </div>
                        <div>
                            <label className="text-gray-600 text-sm">Sticky count:</label>
                            <input type="number" value="2000" className="border-1 p-1 rounded-lg w-20 ml-2" />
                        </div>
                    </div>

                    {/* ✅ Proxy List */}
                    <textarea className="w-full border p-2 rounded-lg h-32 overflow-x-auto overflow-y-auto text-sm sm:text-xs custom-scrollbar"
                        style={{ textWrap: 'nowrap' }}>
                        resi-ww.lightningproxies.net:9999:mvvxgqihzlgcklv120052-zone-resi-session-oX0Cz7gOTUd4
                    </textarea>

                    {/* ✅ Save & Copy Buttons */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                        <button className="text-blue-500 text-sm sm:text-xs">⬇ Save as .txt</button>
                        <button className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow text-sm sm:text-xs">Copy Proxies</button>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default ProxyComponent;
