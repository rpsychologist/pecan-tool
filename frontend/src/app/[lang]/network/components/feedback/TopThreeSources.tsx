import { Fragment } from "react";

const TopThreeSources = ({ sourceNodes, variant }) => {
    const n = sourceNodes.length
    return (
        sourceNodes.map((d, i) => {
            let endSymbol = ""
            switch (true) {
                case n == 1:
                    break;
                case n == 2 && i == 0:
                    endSymbol = " & "
                    break;
                case i < 1:
                    endSymbol = ", "
                    break;
                case i == 1 && n > 2:
                    endSymbol = " & "
            }
            return <Fragment key={i}>
                <span className="font-bold text-[#e74c3c]">{d.label}</span>
                {endSymbol}
            </Fragment>
        })

    )
}

export default TopThreeSources