import { NavLink } from "react-router-dom";

const PurchasePlan = () => {
  return (
    <div className="px-0 xl:px-10 2xl:px-14">
      <div className="flex flex-row justify-end gap-4">
        <div className="flex flex-col gap-4 lg:mr-[10%] 2xl:mr-[22%]">
          <div className="p-2.5 rounded-xl border-1 border-[#c5e3ff]">
            <button className="w-full bg-[#1675ff] text-white text-base px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg">
              Residential
            </button>
          </div>

          <div className="p-2.5 rounded-xl border-1 border-[#c5e3ff]">
          <button className="w-full bg-[#1675ff] text-white text-base px-4 py-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-lg">
              Bandwidth
            </button>
          </div>
        </div>
      </div>

      {/* Plan Selection Buttons */}


      {/* Plan Details Card */}
      <div className="w-full max-w-[480px] p-5 md:p-7 md:py-6 bg-white border border-solid border-[#eaeaeb] rounded-xl mt-5">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-b-[#c5e3ff] pb-3">
        <h3 className="text-[22px] font-semibold mb-0 text-[#292742]">Residential <span className="text-[#1675ff] font-bold">1GB</span></h3>
        <p className="text-[22px] font-semibold mb-0 text-[#292742]"><sup className="text-[#1675ff] font-bold text-base">$</sup>4.50</p>
        </div>
        <p className="text-[#888] text-sm font-normal block border-b border-solid border-b-[#c5e3ff] py-3">Ideal proxies for any use case & purpose. By accessing our 10M+ IP pool non-subnet linked, bans and blocks are non-existent.</p>
        <ul className="py-4 flex flex-col gap-3 pb-7 text-[#292742]">
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> 10M+ Real Residential Peers</li>
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> IP & User-Pass Authentication</li>
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> Country, State, City & ISP Targeting</li>
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> Rotating & Sticky Sessions</li>
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> Unlimited Concurrent Connections</li>
          <li className="text-sm font-medium text-[#292742] flex gap-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="#1675ff" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg> HTTP/SOCKS5 Protocol Supported</li>
        </ul>
        <NavLink to="/checkout" className="w-full bg-[#1675ff] text-white text-base px-4 py-2.5 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:bg-blue-700 transition font-semibold rounded-xl">
            Purchase Plan <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-4 w-4" fill="#fff"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
        </NavLink>
        <NavLink to="/"  className="w-full text-[#888] text-base mt-2 cursor-pointer flex justify-center text-center items-center gap-0.5 hover:text-[#292742] transition font-semibold">Terms & conditions apply</NavLink>
      </div>
    </div>
  );
};

export default PurchasePlan;
