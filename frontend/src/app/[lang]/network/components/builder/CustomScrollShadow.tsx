import { ScrollShadow } from "@heroui/react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { forwardRef, ReactNode } from "react";

type ScrollVisibility = "top" | "bottom" | "both" | "none";

interface CustomScrollShadowProps {
  children: ReactNode;
  scrollVisibility: ScrollVisibility;
  setScrollVisibility: (visibility: ScrollVisibility) => void;
}

const ScrollIndicator = ({
  scrollVisibility,
  show = true,
  showIcon = true,
  label = "Scroll for more",
}: {
  scrollVisibility: ScrollVisibility;
  show?: boolean;
  showIcon?: boolean;
  label?: string;
}) => {
  // should not be shown
  if(!["bottom", "both"].includes(scrollVisibility) || !show) return null
  return (
      <div className="absolute text-zinc-600 bg-opacity-50 bottom-0 left-0 right-0 bg-white p-2 flex justify-center items-center gap-1">
        {showIcon && <FaArrowAltCircleDown />}
       {label}
      </div>
  );
};

const CustomScrollShadow = forwardRef<HTMLDivElement, CustomScrollShadowProps>(
  (
    {
      children,
      scrollVisibility,
      setScrollVisibility,
      scrollIndicator,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <ScrollShadow
          ref={ref}
          hideScrollBar={false}
          size={60}
          offset={60}
          visibility={scrollVisibility as any}
          onVisibilityChange={(visibility) => {
            setScrollVisibility(visibility as ScrollVisibility);
          }}
          {...props}
        >
          {children}
        </ScrollShadow>
        <ScrollIndicator
          scrollVisibility={scrollVisibility}
          show={scrollIndicator?.show}
          showIcon={scrollIndicator?.showIcon}
          label={scrollIndicator?.label}
        />
      </>
    );
  }
);

CustomScrollShadow.displayName = "CustomScrollShadow";

export default CustomScrollShadow;
