export const clipboardUtils = {
  /**
   * Copies text to the user's clipboard.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  async copy(text: string): Promise<boolean> {
    if (typeof navigator?.clipboard === "undefined") {
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy text: ", error);
      return false;
    }
  },
};
