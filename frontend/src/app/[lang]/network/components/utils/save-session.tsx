const saveSession = (state) => {
    sessionStorage.setItem("state", JSON.stringify(state));
  }
export default saveSession