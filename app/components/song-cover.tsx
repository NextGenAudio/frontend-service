import Image from "next/image";
import { Song } from "../utils/music-context";
export default function SongCover({ song }: { song: Song }) {
  const picture = song.artworkURL || song?.metadata?.cover_art;

  if (!picture) {
    // fallback image
    return (
      <Image
        src="/default-cover.png"
        alt="Default Cover"
        width={500}
        height={500}
      />
    );
  }

  // Convert binary data to base64 string
  // const base64String = btoa(
  //   new Uint8Array(picture.data).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ""
  //   )
  // );

  // const imageSrc = `data:${picture.format};base64,${base64String}`;

  return (
    <Image
      src={picture}
      alt="Song Cover"
      width={500}
      height={500}
      unoptimized
    />
  );
}
