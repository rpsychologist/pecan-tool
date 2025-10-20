const getThumbBg = (size, touched) => {
  switch (true) {
    case size > 50:
      return "bg-danger-600";
    case size < 50:
      return "bg-success-600";
    case touched === false:
      return "bg-gray-300";
    case size == 50:
      return "bg-black";
  }
};

export default getThumbBg;
