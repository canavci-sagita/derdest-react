export const slideVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: "0.25rem",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
