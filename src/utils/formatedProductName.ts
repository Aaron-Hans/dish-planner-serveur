import logger from "../config/logger";

/**
 * Formats a product name by capitalizing the first letter and converting the rest to lowercase
 * @param name - The product name to format
 * @returns string - The formatted product name with first letter capitalized
 */
export const formatedProductName = (name: string): string => {
    logger.debug("Formatting product name", { originalName: name });
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    logger.debug("Product name formatted", { formattedName });
    return formattedName;
}
