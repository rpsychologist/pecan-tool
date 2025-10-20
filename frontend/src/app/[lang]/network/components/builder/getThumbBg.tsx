const getThumbBg = (size, touched, reverse = false) => {
    switch (true) {
        case size > 50 && !reverse:
        case size < 50 && reverse:
            return 'bg-danger-600'
        case size < 50 && !reverse:
        case size > 50 && reverse:
            return 'bg-success-600'
        case touched === false:
            return 'bg-gray-300'
        case size == 50:
            return 'bg-black'
    }
}

export default getThumbBg;
