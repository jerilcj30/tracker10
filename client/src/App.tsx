import { Routes, Route, Link } from "react-router-dom";
import { GlobeIcon, GearIcon } from "@radix-ui/react-icons";

import Home from "./pages/pageHome";
import Campaigns from "./pages/pageCampaigns";
import Flows from "./pages/pageFlows";
import Landers from "./pages/pageLanders";
import Offers from "./pages/pageOffers";
import AffiliateNetworks from "./pages/pageAffiliateNetworks";
import TrafficSources from "./pages/pageTrafficSources";
import Logs from "./pages/pageLogs";
import Settings from "./pages/pageSettings";

import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { ModeToggle } from "./components/ui/mode-toggle";
import Campaign from "./pages/pageCampaign";
import Heatmap from "./pages/pageHeatmap";

function App() {
  return (
    <>
      <div className="flex mb-5 mt-5">
        <div className="logo">
          <GlobeIcon className="w-10 h-10" />
        </div>
        <div className="flex gap-5 ml-auto">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/">Home</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/campaigns">Campaigns</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/flows">Flows</Link>
              </MenubarTrigger>

              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/landers">Landers</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/offers">Offers</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/affiliate_networks">Affiliate Networks</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/traffic_sources">Traffic Sources</Link>
              </MenubarTrigger>
              <MenubarSeparator />
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link to="/logs">Logs</Link>
              </MenubarTrigger>
            </MenubarMenu>            
          </Menubar>
          <div className="border rounded-md p-2 cursor-pointer"><Link to="/settings"><GearIcon className="w-6 h-6" /></Link></div>
          <ModeToggle />
          
          
        </div>
      </div>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/flows" element={<Flows />} />
          <Route path="/landers" element={<Landers />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/affiliate_networks" element={<AffiliateNetworks />} />
          <Route path="/traffic_sources" element={<TrafficSources />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign/:id" element={<Campaign />} />
          <Route path="/heatmap/:id" element={<Heatmap />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
