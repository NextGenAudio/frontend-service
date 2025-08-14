import { MusicPlayer } from "@/app/components/music-player";
import { SideBar } from "../components/sidebar";

const Home = () => {
  return (
    <div className="rounded-3xl overflow-hidden h-screen">
      <SideBar />
      <div className="bg-pink-600">
        <MusicPlayer />
      </div>
    </div>
  );
};

export default Home;
