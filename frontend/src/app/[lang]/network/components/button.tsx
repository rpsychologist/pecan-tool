import classNames from "classnames"


const Button = ({
  text,
  appearance,
  compact = false,
  icon = false,
  handleClick,
  type,
  disabled = false,
  smallText = false,
  ariaLabel,
}) => {
  return (
    <button
      onClick={handleClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames(
        // Common classes
        "focus-visible:btn-focus focus-visible:dark:btn-focus-dark block w-full justify-center rounded-md border-2 text-center text-base font-semibold tracking-wide lg:w-auto dark:text-white",
        {
          "md:text-sm": smallText === true,
        },
        {
          "md:text-base": smallText === false,
        },
        // Full-size button
        {
          "px-8 py-4": compact === false && icon == false,
        },
        // Compact button
        {
          "px-6 py-2": compact === true && icon == false,
        },
        {
          "border-transparent bg-white px-2 py-2 text-black hover:border-gray-400  dark:bg-transparent dark:bg-none dark:text-white":
            icon === true,
        },
        // Specific to when the button is fully dark
        {
          "border-slate-900 bg-slate-900 text-white shadow-xl dark:border-black dark:border-white dark:bg-white dark:text-black":
            appearance === "dark",
        },
        // Specific to when the button is dark outlines
        {
          "border-gray-300 bg-white text-black hover:border-gray-400 dark:border-white dark:bg-transparent dark:bg-none dark:text-white dark:hover:border-gray-400":
            appearance === "dark-outline",
        },
        {
          "border-gray-300 bg-transparent text-red-500 hover:border-red-400 hover:bg-red-600 hover:text-white dark:border-white  dark:text-red-500 dark:hover:border-red-400 dark:hover:text-white":
            appearance === "dark-outline-warn",
        },
        // warning
        {
          "border-red-500 bg-red-500 text-white": appearance === "warning",
        },
        // Specific to when the button is fully white
        {
          "border-white bg-white text-primary-600": appearance === "white",
        },
        // Specific to when the button is white outlines
        {
          "border-white text-white hover:border-gray-600":
            appearance === "white-outline",
        },
        {
          "cursor-not-allowed opacity-50": disabled,
        }
      )}
    >
      {text}
    </button>
  )
}

export default Button
