import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/style.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FirstTask from "../components/FirstTask";

const Hompage = () => {
  let titleTask = React.createRef();
  const MySwal = withReactContent(Swal);
  const [toDoList, setToDo] = useState([]);

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = async () => {
    axios
      .get(`https://api.todoist.com/rest/v1/tasks`, {
        headers: {
          Authorization: `Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258`,
        },
      })
      .then((response) => {
        const toDo = response.data.filter((task) => {
          return task.section_id === 0;
        });
        setToDo(toDo);
      })
      .catch((error) => console.log(error));
  };

  const addToDo = () => {
    let data = JSON.stringify({
      content: titleTask.current.value,
    });

    let config = {
      method: "post",
      url: "https://api.todoist.com/rest/v1/tasks",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        if (response) {
          MySwal.fire({
            title: "Success",
            text: "Add New Task!",
            icon: "success",
          });
          getTodo();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    titleTask.current.value = "";
  };

  const delToDo = (id) => {
    let config = {
      method: "delete",
      url: `https://api.todoist.com/rest/v1/tasks/${id}`,
      headers: {
        Authorization: "Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258",
      },
    };

    MySwal.fire({
      title: "Do you want to delete from list task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios(config)
          .then((response) => {
            if (response) {
              getTodo();
            }
          })
          .catch((error) => {
            console.log(error);
          });
        MySwal.fire("Deleted!", "", "success");
      }
    });
  };

  const closeToDo = (id) => {
    let config = {
      method: "post",
      url: `https://api.todoist.com/rest/v1/tasks/${id}/close`,
      headers: {
        Authorization: "Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258",
      },
    };

    MySwal.fire({
      title: "Do you want to move your task to completed list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios(config)
          .then((response) => {
            if (response) {
              getTodo();
            }
          })
          .catch((error) => {
            console.log(error);
          });
        MySwal.fire("Task Completed!", "", "success");
      }
    });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row py-4">
          <h1 className="text-muted text-center">todos</h1>
        </div>
        <div className="row">
          <div className="col-lg">
            <div className="mb-3">
              <input type="text" className="form-control border-0 border-bottom" id="addTask" ref={titleTask} placeholder="Add new task...." />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={() => addToDo()}>
                Add Task
              </button>
            </div>
          </div>
        </div>
        <div className="row py-4 justify-content-center">
          {toDoList.length !== 0 ? (
            <div className="col-lg-12">
              <ul className="list-group">
                {toDoList.map((items) => {
                  return (
                    <li className="list-group-item border-0 border-bottom d-flex" key={items.id}>
                      <Link to={`/detail/${items.id}`} className="text-decoration-none text-dark">
                        {items.content}
                      </Link>
                      <div className="ms-auto">
                        <button onClick={() => closeToDo(items.id)} className="btn btn-primary btn-sm">
                          Complete Task
                        </button>{" "}
                        <button onClick={() => delToDo(items.id)} className="btn btn-danger btn-sm">
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <FirstTask />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Hompage;
