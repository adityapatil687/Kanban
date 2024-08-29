import React, { createContext, useEffect, useState } from "react";
export const ListContext = createContext();

const ListContextProvider = ({ children }) => {
  const [list, setList] = useState([
    {
      name: "Kanban",
      start_date: "22/05/2026",
      deadline: "25/05/2027",
      createdby: {
        name: "Aditya Patil",
        profileImage: require("../assets/user_3d.jpg"),
        email: "manager@gmail.com",
      },
      team: [
        {
          userid: "1234zxdfsd7868",
          name: "user 1",
          profileImage: require("../assets/user_3d.jpg"),
          email: "user1@email.com",
          role: "helper",
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 2",
          profileImage: require("../assets/user_3d.jpg"),
          email: "user2@email.com",
          role: "helper",
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 3",
          profileImage: require("../assets/user_3d.jpg"),
          email: "user3@email.com",
          role: "helper",
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 4",
          profileImage: require("../assets/user_3d.jpg"),
          email: "user2@email.com",
          role: "helper",
        },
      ],
      tasks: [
        {
          title: "Do somethin 1",
        },
        {
          title: "Do somethin 2",
        },
      ],
      completedTasks: [],
    },
   
  ]);

  const [activeList, setActiveList] = useState(() => {
    return localStorage.getItem("activeList") || "";
  });

  useEffect(() => {
    localStorage.setItem("activeList", activeList);
    console.log("activeList => ", activeList);
  }, [activeList]);

  useEffect(() => {
    console.log("Project list => ", list);
  }, [list]);
  return (
    <ListContext.Provider value={{ list, setList, activeList, setActiveList }}>
      {children}
    </ListContext.Provider>
  );
};

export default ListContextProvider;
