
import { useState } from "react";
import { Input, Button } from "@heroui/react";
import DICT from "./dict";

const NetworkUrl = ({ url, lang }) => {
    const [bttnText, setBttnText] = useState(DICT[lang].url_copy);

    const copyCode = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setBttnText(DICT[lang].url_copied);
                setTimeout(function () {
                    setBttnText(DICT[lang].url_copy);
                }, 3000);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    return (

        <div className="container max-w-2xl mx-auto flex gap-2">
            <Input
                isReadOnly
                type="url"
                variant="bordered"
                defaultValue={url}
            />
            <Button onClick={copyCode} color="primary" >{bttnText}</Button>
        </div>
    )
}
export default NetworkUrl