import Markdown from 'markdown-to-jsx'

const RichText = ({ content, optionsOverrides = {} }) => {
    return (
        <section className="max-w-lg mx-auto rich-text py-6 prose-lg dark:bg-black dark:text-gray-50 print:max-w-none print:w-full">
            <Markdown
                children={content}
                options={{
                    overrides: optionsOverrides
                }}
            />
        </section>
    );
}

export default RichText