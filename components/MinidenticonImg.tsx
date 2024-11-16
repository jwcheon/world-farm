import { minidenticon } from "minidenticons";
import { useMemo } from "react";

export const MinidenticonImg = ({
  username,
  saturation,
  lightness,
  ...props
}: {
  username: string;
  saturation?: string;
  lightness?: number;
  [key: string]: any;
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return <img src={svgURI} alt={username} {...props} />;
};
