const atmosphereHeight = 265;

const background = [
  "linear-gradient(to top, #05133d 0%, #01010e 30%, #000000 43%)",
  "linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0))",
].join(",");

const atmosphereGlow =
  "radial-gradient(125% 82% at 50% 100%, rgba(125, 190, 255, 0.18) 0%, rgba(24, 102, 178, 0.12) 38%, rgba(1, 9, 28, 0) 78%)";

const atmosphereHaze =
  "radial-gradient(120% 82% at 50% 100%, rgba(46, 122, 214, 0.22) 0%, rgba(13, 64, 123, 0.16) 48%, rgba(1, 3, 16, 0) 82%)";

const atmosphere =
  "radial-gradient(170% 82% at 50% 100%, #b9def5 0%, #4aa3e2 10%, #1771c4 30%, #104f8e 48%, #08223f 68%, rgba(1, 3, 16, 0) 100%)";

const WIDTH = 1200;

export function OgImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 48,
      }}
    >
      <div
        style={{
          background: atmosphereGlow,
          bottom: 0,
          height: atmosphereHeight,
          left: 0,
          position: "absolute",
          width: WIDTH,
        }}
      />
      <div
        style={{
          background: atmosphereHaze,
          bottom: 0,
          height: atmosphereHeight,
          left: 0,
          position: "absolute",
          width: WIDTH,
        }}
      />
      <div
        style={{
          background: atmosphere,
          bottom: 0,
          height: atmosphereHeight,
          left: 0,
          position: "absolute",
          width: WIDTH,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontFamily: "Inter",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <span
          style={{
            fontSize: 28,
            fontFamily: "Inter",
            color: "#d1d5db",
            marginTop: 8,
          }}
        >
          {description}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <img
            src="https://bsx-main.b-cdn.net/pfp.webp"
            alt="Avatar"
            width={64}
            height={64}
            style={{ borderRadius: "50%" }}
          />
          <span
            style={{
              fontSize: 24,
              fontFamily: "Inter",
              fontWeight: 600,
              color: "white",
              marginLeft: 16,
            }}
          >
            blog.bentsignal.com
          </span>
        </div>
      </div>
    </div>
  );
}
