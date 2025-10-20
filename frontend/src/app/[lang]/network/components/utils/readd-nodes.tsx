const addNodesToLinks = (data) => {
    if (data.links.length > 0) {
        data.links = data.links.map(m => {
          const newTarget = data.nodes.filter(f => f.id == m.target.id)[0]
          const newSource = data.nodes.filter(f => f.id == m.source.id)[0]
          // TODO: this avoids breaking the app, but links are still shown
          if (typeof newSource !== "undefined" && typeof newTarget !== "undefined") {
              m.source = newSource
              m.target = newTarget
              return m;
          } else {
              return m
          }
      }).filter(d => d)
    }
    return data
}

export default addNodesToLinks