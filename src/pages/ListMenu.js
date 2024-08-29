import React, { useContext, useEffect } from "react";
import ListCard from "../fragments/listcard";
import { ListContext } from "../context/list";

function ListMenu() {
  
  const { list, setList, activeList, setActiveList } = useContext(ListContext);

  useEffect(()=>{
    setActiveList("")
  },[])

  return (
    <div className="container">
      <div className="row my-auto py-3">
        {list.map((task, index) => (
          <ListCard
            key={index}
            name={task.name}
            totalTasks={task.totalTasks} // Assuming you have this value
            completedTasks={task.completedTasks} // Assuming you have this value
            deadline={task.deadline}
            teamMembers={task.team} // Passing team members array
          />
        ))}
      </div>
    </div>
  );
}

export default ListMenu;
