import { PlaylistDetailsPanel } from "../../../components/playlist-details-panel";
import React from "react";

const page = ({ params }: { params: { id: number } }) => {
  return (
    <div>
      <div className="h-screen">
        <PlaylistDetailsPanel playlistId={params.id} />
      </div>
    </div>
  );
};

export default page;
