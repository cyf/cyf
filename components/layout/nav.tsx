import Navbar from "./navbar";
import { LngProps } from "@/i18next-lng";

export default async function Nav(props: LngProps) {
  return <Navbar lng={props.lng} />;
}
