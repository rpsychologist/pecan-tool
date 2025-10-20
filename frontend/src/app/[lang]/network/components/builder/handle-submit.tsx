const handleSubmit = async (data) => {

    const res = await fetch("/api/network", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            networkData: {
                ...data,
                nodes: data.nodes.filter(d => d.chosen),
                links: data.links.map((d) => ({
                    "target": {
                        "nodeId": d.target.nodeId,
                        "id": d.target.id
                    },
                    "source": {
                        "nodeId": d.source.nodeId,
                        "id": d.source.id,
                    },
                    "size": d.size,
                    "display": d.display,
                    "index": d.index
                }))
            },
            referrer: typeof window !== "undefined" && window.document.referrer,
            screen: typeof window !== "undefined" && {
                width: window.screen.width,
                height: window.screen.height,
                devicePixelRatio: window.devicePixelRatio
            }
        }),
    });
    if (!res.ok) {
        console.error("Failed to submit.");
        return;
    }
    const { url } = await res.json()
    return url
}

export default handleSubmit