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
import TaskNotFound from "../components/TaskNotFound";

const Hompage = () => {
  let titleTask = React.createRef();
  const MySwal = withReactContent(Swal);
  const [toDo, setToDo] = useState([]);
  const [toDoList, setSearch] = useState(toDo);
  const [loadPage, setLoadPage] = useState(false);

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
        const dataToDo = response.data.filter((task) => {
          return task.section_id === 0;
        });
        setToDo(dataToDo);
        setSearch(dataToDo);
        setLoadPage(true);
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
      .then(() => {
        getTodo();
        MySwal.fire({
          title: "Success",
          text: "Add new task!",
          icon: "success",
        });
      })
      .catch(() => {
        MySwal.fire({
          title: "Opps!",
          text: "Can't add new task!",
          icon: "error",
        });
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
          .then(() => {
            getTodo();
            MySwal.fire("Deleted!", "", "success");
          })
          .catch(() => {
            MySwal.fire("Opps!", "", "error");
          });
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
          .then(() => {
            getTodo();
            MySwal.fire("Task Completed!", "", "success");
          })
          .catch(() => {
            MySwal.fire("Opps!", "", "error");
          });
      }
    });
  };

  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const searchToDo = (keywordSearch) => {
    const searchRegex = new RegExp(escapeRegExp(keywordSearch), "i");
    const filterToDo = toDo.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field] ? row[field].toString() : null);
      });
    });
    setSearch(filterToDo);
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
        <div className="row py-4 justify-content-center gap-3">
          {toDo.length > 0 ? (
            <div className="col-lg-12 d-flex justify-content-end">
              <input type="text" className="form-control border-0 border-bottom" style={{ width: "250px" }} placeholder="Search task...." onChange={(e) => searchToDo(e.target.value)} />
            </div>
          ) : (
            ""
          )}

          {loadPage ? (
            toDo.length !== 0 ? (
              toDoList.length !== 0 ? (
                <div className="col-lg-12">
                  <ul className="list-group">
                    {toDoList.map((items) => {
                      return (
                        <li className="list-group-item border-0 border-bottom d-flex" key={items.id}>
                          <Link to={`/detail/${items.id}`} className="text-decoration-none text-dark">
                            {items.content.length >= 100 ? items.content.substring(0, 100) + "..." : items.content}
                          </Link>
                          <div className="ms-auto d-flex flex-wrap gap-2">
                            <button onClick={() => closeToDo(items.id)} className="btn btn-primary btn-sm">
                              Mark as Complete
                            </button>
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
                <TaskNotFound />
              )
            ) : (
              <FirstTask />
            )
          ) : (
            <h2 className="text-center">Loading....</h2>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Hompage;
