import React, { Children, createContext, useEffect, useState } from "react";
export const TabContext = createContext()

const TabContextProvider = ({children}) => {
    const [activeTab, setActiveTab] = useState("Tasks")
    useEffect(()=>{
        // console.log(activeTab)
    })
    return(
        <TabContext.Provider value={{activeTab, setActiveTab}}>
            {children}
        </TabContext.Provider>
    )
}

export default TabContextProvider