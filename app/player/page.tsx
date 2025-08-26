import { MusicPlayer } from "@/app/components/music-player";
import { SideBar } from "../components/sidebar";

const Home = () => {
  return (
    <div className="relative h-screen overflow-hidden ">
      <div className="absolute top-0 left-0 h-screen rounded-[32px] w-screen bg-gradient-to-bl from-orange-400 via-orange-700 to-red-700 z-0"></div>
      {/* Sidebar with higher z-index */}
      <div className="absolute top-0 left-0 z-10">
        <SideBar />
      </div>

      {/* Music player positioned to not overlap sidebar */}
      <div className="absolute w-screen  z-0">
        <MusicPlayer />
      </div>
    </div>
  );
};

export default Home;
