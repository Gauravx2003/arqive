import { use } from "react";
import ClientFilesPage from "@/components/ClientFilesPage";

const Page = (props: { params: Promise<{ type: string }> }) => {
  const { type } = use(props.params); // ✅ unwrap using React.use()

  return <ClientFilesPage type={type} />;
};

export default Page;
