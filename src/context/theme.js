import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.getElementsByTagName("body")[0].setAttribute("data-bs-theme", theme);
    }, [theme]); // Re-run the effect when 'theme' changes

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
