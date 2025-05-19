import Link from "next/link";
import Image from "next/image";
import NexGenLogo from "@/public/nexgen-logo.png";
import { LogoLinkProps } from "../login/login-form.types";
const LogoLink: React.FC<LogoLinkProps> = ({
  href = "/",
  width = 250,
  height = 40,
  alt = "NexGen Materials Logo",
}) => {
  return (
    <Link href={href}>
      <Image
        src={NexGenLogo}
        alt={alt}
        width={width}
        height={height}
        priority
      />
    </Link>
  );
};

export default LogoLink;
