import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { clientQuestions } from "./mapData";
import { slugToTitle } from "@/functions/slugToTitle";

const ClientQuestion = ({ topic }: { topic: string }) => {
  const targetObject = clientQuestions.find((obj) => obj.topic === topic);
  const purifiedTitle = slugToTitle(topic);

  if (!targetObject) {
    return (
      <Card className="mx-auto my-5 max-w-3xl rounded-2xl bg-white p-6 text-center shadow-md">
        <p className="text-lg font-semibold text-red-500">
          No questions found for topic: {topic}
        </p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto my-5 max-w-3xl rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-lg">
      {/* Header */}
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        {purifiedTitle}
      </h1>

      {/* Accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="item-1"
      >
        {targetObject.questions.map((q, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="overflow-hidden rounded-lg rounded-b-none border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
          >
            <AccordionTrigger className="rounded-b-none bg-gray-100 px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-200">
              {q.question}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 bg-white px-5 py-4 text-gray-700">
              {q.answer.map((ans, ansIndex) => (
                <p
                  key={ansIndex}
                  className="flex items-start gap-2 border-b border-gray-200 py-2 text-sm leading-relaxed"
                >
                  {ans}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default ClientQuestion;
