import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data: sessionData } = useSession();
  console.log("sessionData", sessionData);
  const { data: voices, isLoading } = api.voice.getVoiceByUser.useQuery();
  console.log("voices", voices);

  return (
    <>
      <main></main>
    </>
  );
}
