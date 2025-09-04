import { MusicPlayer } from "@/app/components/music-player";
import { Sidebar } from "../components/sidebar";
import { SidebarProvider } from "../utils/sidebar-context";

const Home = () => {
  return (
    <div className="relative h-screen overflow-hidden ">
      <SidebarProvider>
        <div className="absolute top-0 left-0 h-screen rounded-[32px] w-screen bg-gradient-to-bl from-orange-400 via-orange-700 to-red-700 z-0"></div>
        {/* Sidebar with higher z-index */}
        <div className="absolute top-0 left-0 z-10">
          <Sidebar />
        </div>

        {/* Music player positioned to not overlap sidebar */}
        <div className="absolute w-screen  z-0">
          <MusicPlayer />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;
