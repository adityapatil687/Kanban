import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import ActionModal from "./model"; // Import the modal component

import { UserContext } from "../context/user";
import { ListContext } from "../context/list";
import { TabContext } from "../context/tab"; // Import the TabContext
import { useNavigate } from "react-router-dom";

function TopNavBar() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isCreateList, setIsCreateList] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { isSignedIn, setIsSignedIn } = useContext(UserContext);
  const { userData } = useContext(UserContext);
  const { list, setList, activeList, setActiveList } = useContext(ListContext);
  const { activeTab, setActiveTab } = useContext(TabContext); // Destructure TabContext

  const navigate = useNavigate();

  const handleShowModal = (title, placeholder, createList = false) => {
    setModalTitle(title);
    setInputPlaceholder(placeholder);
    setInputValue("");
    setIsCreateList(createList);
    setStartDate("");
    setTargetDate("");
    setErrorMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = () => {
    if (isCreateList) {
      // Check if a list with the same name already exists
      const isDuplicate = list.some(
        (l) => l.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (isDuplicate) {
        setErrorMessage(
          "List already exists. Please choose a different name."
        );
        return;
      }
      if (targetDate < startDate) {
        setErrorMessage(
          "Target deadline date cannot be earlier than the start date."
        );
        return;
      }

      const list_item = {
        name: inputValue,
        start_date: startDate,
        deadline: targetDate,
        createdby: {
          name: userData.name,
          profileImage: userData.profileImage,
          email: userData.email,
          role: "manager",
        },
        team: [],
        tasks: [],
        completedTasks: [], // Ensure completedTasks is included
      };
      setList((prevList) => [...prevList, list_item]);
    } else if (modalTitle === "Add Member") {
      setList((prevList) =>
        prevList.map((l) =>
          l.name === activeList
            ? {
                ...l,
                team: [
                  ...l.team,
                  { name: inputValue, email: inputValue, profileImage: "", role: "helper" },
                ],
              }
            : l
        )
      );
    } else if (modalTitle === "Add Task") {
      setList((prevList) =>
        prevList.map((l) =>
          l.name === activeList
            ? {
                ...l,
                tasks: [...l.tasks, { title: inputValue, completed: false }],
              }
            : l
        )
      );
    }

    handleCloseModal();
  };

  // Calculate task statistics
  const taskStats = {
    total: 0,
    completed: 0,
    pending: 0,
  };

  const activeListData = list.find((l) => l.name === activeList);

  if (activeListData) {
    taskStats.total = activeListData.tasks.length;
    taskStats.completed = activeListData.completedTasks.length; // Update this line
    taskStats.pending = taskStats.total - taskStats.completed;
  }

  return (
    <>
      <ActionModal
        show={showModal}
        title={modalTitle}
        placeholder={inputPlaceholder}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
        isCreateList={isCreateList}
        startDate={startDate}
        setStartDate={setStartDate}
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        errorMessage={errorMessage}
      />

      <Navbar expand="lg" className="bg-body-tertiary border-bottom">
        <Container fluid>
          <span className="">
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Brand href="/" className="ms-2 ">
              {activeList || "Kanban"}
            </Navbar.Brand>
          </span>

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
              {activeList || "Kanban"}
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              {isSignedIn === true ? (
                <>
                  <Nav className="justify-content-end flex-grow-1">
                    {activeList ? (
                      <>
                        <Nav.Link
                          className="me-2 d-flex my-auto border bg-primary-subtle rounded"
                          onClick={() =>
                            handleShowModal("Add Member", "Enter member email")
                          }
                        >
                          <span className="text-primary-emphasis">
                            Add Member
                          </span>
                        </Nav.Link>

                        <Nav.Link
                          className="me-2 d-flex my-auto border bg-danger-subtle rounded"
                          onClick={() =>
                            handleShowModal("Add Task", "Enter task title")
                          }
                        >
                          <span className="text-danger-emphasis">Add Task</span>
                        </Nav.Link>
                      </>
                    ) : (
                      <>
                        <Nav.Link
                          className="me-2 d-flex my-auto"
                          onClick={() =>
                            handleShowModal(
                              "Create List",
                              "Enter list name",
                              true
                            )
                          }
                        >
                          <i className="bi bi-list-task me-2 h4 my-auto text-dark-emphasis"></i>
                          <span className="text-dark-emphasis">
                            Create list
                          </span>
                        </Nav.Link>
                      </>
                    )}
                  </Nav>

                  {activeListData && (
                    <Dropdown className="me-3 bg-warning-subtle border rounded my-auto">
                      <Dropdown.Toggle variant="" id="dropdown-team">
                        Team Members
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {activeListData.team.length > 0 ? (
                          activeListData.team.map((member, index) => (
                            <Dropdown.Item
                              key={index}
                              className="d-flex align-items-center"
                            >
                              <Image
                                src={
                                  member.profileImage || "default-avatar.png"
                                } // Placeholder image
                                roundedCircle
                                width={25}
                                className="me-2"
                              />
                              <span>{member.name}</span>
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item>No members added yet</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}

                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <span className="">
                        <Image
                          src={require("../assets/user_3d.jpg")}
                          roundedCircle
                          width={30}
                          className="me-2"
                        />
                        {userData.name}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {activeListData && (
                        <>
                          <Dropdown.Item
                            className=""
                            onClick={() => setActiveTab("Tasks")}
                          >
                            Tasks{" "}
                            <span className="badge text-bg-primary">
                              {taskStats.total}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item
                            className=""
                            onClick={() => setActiveTab("Completed Tasks")}
                          >
                            Completed{" "}
                            <span className="badge text-bg-success">
                              {taskStats.completed}
                            </span>
                          </Dropdown.Item>

                          <Dropdown.Divider />
                        </>
                      )}
                      <Dropdown.Item
                        className=""
                        onClick={() => {setIsSignedIn(false); navigate("/")}}
                      >
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Nav className="py-4"></Nav>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default TopNavBar;
  