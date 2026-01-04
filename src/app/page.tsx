import { redirect } from "next/navigation";
import { Paths } from "@/config/constants";

export default function Home() {
  return redirect(Paths.EMAIL);
}
