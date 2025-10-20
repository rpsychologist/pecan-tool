import { Popover, PopoverTrigger, Button, PopoverContent } from "@heroui/react";
import { FaQuestionCircle } from "react-icons/fa";

const MoreInfo = ({ children }) => {
    return (
        <Popover placement="right">
            <PopoverTrigger>
                <Button isIconOnly color="default" variant="light" size="sm" aria-label="Mer information" className="">
                    <FaQuestionCircle className="w-5 h-5 fill-zinc-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2 max-w-xs">
                    {/* <div className="text-small font-bold">Förklaring</div> */}
                    <div className="text-small paragraph">{children}</div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
export default MoreInfo