import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    body: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  // TODO: STYLE THE MARKDOWN
  return (
    <section className="max-w-lg mx-auto rich-text py-6 dark:bg-black dark:text-gray-50 ">
      <Markdown children={data.content} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
