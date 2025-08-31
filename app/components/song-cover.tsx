import Image from "next/image";

export default function SongCover({ song }: { song: any }) {
  const picture = song?.metadata?.picture?.[0];

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
  const base64String = btoa(
    new Uint8Array(picture.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const imageSrc = `data:${picture.format};base64,${base64String}`;

  return (
    <Image
      src={imageSrc}
      alt="Song Cover"
      width={500}
      height={500}
    />
  );
}
