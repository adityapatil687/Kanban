import React, { useContext } from "react";
import { ListContext } from "../context/list"; // Make sure the path is correct
import { Link } from "react-router-dom";
function ListCard({ name, totalTasks, completedTasks, deadline, teamMembers }) {
  const { list, setList, activeList, setActiveList } = useContext(ListContext);

  // Function to handle delete action
  const handleDelete = (listName) => {
    // Filter out the list that matches the name
    const updatedList = list.filter((item) => item.name !== listName);
    setList(updatedList);
  };

  return (
    <div className="col-md-3 gy-3">
      <div
        className="card text-start bg-body-tertiary"
        style={{ cursor: "pointer", position: "relative" }}
      >
        {/* Delete Icon Button */}
        <button
          className="btn-sm bg-danger btn-sm m-1 rounded text-light"
          onClick={(e) => {
            handleDelete(name);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
          }}
        >
          <i className="bi bi-trash h6 "></i>
        </button>
        <Link
          className=" text-decoration-none text-light"
          to={`/${name}`}
          onClick={() => {
            setActiveList(`${name}`);
          }}
        >
          <div className="card-body">
            <h5 className="card-title h4">{name}</h5>
            <p className="card-text">
              Deadline: <span className="badge bg-success">{deadline}</span>
            </p>

            {/* Team members profile circles */}
            <div className="team-members">
              {teamMembers.slice(0, 3).map((member, index) => (
                <img
                  key={index}
                  src={member.profileImage}
                  alt={member.name}
                  className="profile-image"
                />
              ))}
              {teamMembers.length > 3 && (
                <span className="profile-count text-dark-emphasis">
                  + {teamMembers.length - 3} others
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ListCard;
