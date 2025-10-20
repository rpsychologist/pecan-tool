
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { FaExclamationCircle } from "react-icons/fa";
import Markdown from 'markdown-to-jsx'

import NetworkUrl from "./NetworkUrl";
const InviteDyad = ({ content, invited, pid, role, lang }) => {
    const { enabled, header, description, footer } = content
    if(enabled !== true || pid == null) return false
    let url
    let showComponent
    if (invited == null || invited == "false") {
        if (role == "parent") {
            url = `https://redcap.ki.se/redcap/surveys/?s=M7X8KNMXMTRNH94W&invited=true&invitedby=${pid}`
            showComponent = "true"
        } else if (role == null) {
            url = `https://redcap.ki.se/redcap/surveys/?s=LX7X9KJEXJLPKEHM&invited=true&invitedby=${pid}`
            showComponent = "true"
        }

    } else if (invited == "true") {
        showComponent = "false"
    }
    if (showComponent !== "true") return false
    return (
        <div className="max-w-2xl mx-auto prose-lg py-6">
            <Card>
                <CardHeader className="flex gap-3 text-xl font-bold">
                    <FaExclamationCircle className="w-5 h-5 fill-zinc-500" />
                    <h2>{header}</h2>

                </CardHeader>
                <Divider />
                <CardBody className="gap-3">
                    <Markdown
                        className="space-y-3"
                        children={description}
                    />

                    <NetworkUrl url={url} lang={lang} />
                </CardBody>
                <Divider />
                <CardFooter>
                    <p className="text-small italic">{footer}</p>
                </CardFooter>
            </Card>
        </div>
    )


}

export default InviteDyad