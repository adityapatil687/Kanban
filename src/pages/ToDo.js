import { useContext, useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { ListContext } from "../context/list";
import { TabContext } from "../context/tab";
import { useParams } from "react-router-dom";

function ToDo() {
  const { list, setList } = useContext(ListContext);
  const { activeTab } = useContext(TabContext);
  const { listName } = useParams();

  const [localList, setLocalList] = useState(() => {
    const initialList = list.find((l) => l.name === listName);
    return initialList || { tasks: [], completedTasks: [] };
  });

  // Sync localList with context when list changes
  useEffect(() => {
    const updatedList = list.find((l) => l.name === listName);
    if (updatedList) {
      setLocalList(updatedList);
    }
  }, [list, listName]);

  if (!localList) return <p>List not found</p>;

  const handleTaskDelete = (task) => {
    // Move task from tasks to completedTasks
    const updatedTasks = localList.tasks.filter((t) => t.title !== task.title);
    const updatedCompletedTasks = [...localList.completedTasks, task];

    setLocalList({
      ...localList,
      tasks: updatedTasks,
      completedTasks: updatedCompletedTasks,
    });

    // Optionally update the context or server
    setList((prevLists) =>
      prevLists.map((l) =>
        l.name === listName
          ? { ...l, tasks: updatedTasks, completedTasks: updatedCompletedTasks }
          : l
      )
    );
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col">
          {activeTab === "Tasks" && (
            <>
              <div className="d-flex">
                <h4 className="mb-4">{activeTab} </h4>
                <h6>
                  <span className="ms-2 mt-1 badge text-bg-primary">
                    {localList.tasks.length}
                  </span>
                </h6>
              </div>

              {localList.tasks.map((item, index) => (
                <div key={index} className="mb-3">
                  <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <span>{item.title}</span>
                      <Button
                        variant="link"
                        className="py-1 bg-danger"
                        onClick={() => handleTaskDelete(item)}
                      >
                        <i className="bi bi-trash h6 text-light"></i>
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </>
          )}
          {activeTab === "Completed Tasks" && (
            <>
              <h4 className="mb-4 d-flex">
                {activeTab}{" "}
                <h6>
                  <span className="ms-2 mt-1 badge text-bg-success">
                    {localList.completedTasks.length}
                  </span>
                </h6>
              </h4>
              {localList.completedTasks.map((item, index) => (
                <div key={index} className="mb-3">
                  <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <span>{item.title}</span>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToDo;
