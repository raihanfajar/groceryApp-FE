import ClientQuestion from "@/components/clientQuestions/ClientQuestion";
import Topics from "@/components/clientQuestions/Topics";
import CustomBorder from "@/components/homePage/CustomBorder";

const DynamicTopicPage = async ({
  params,
}: {
  params: Promise<{ dynamic: string }>;
}) => {
  const dynamic = (await params).dynamic;

  return (
    <div className="mx-auto min-h-screen">
      <ClientQuestion topic={dynamic} />
      <CustomBorder />
      <Topics />
    </div>
  );
};

export default DynamicTopicPage;
