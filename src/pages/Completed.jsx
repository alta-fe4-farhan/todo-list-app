import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Completed = () => {
  const MySwal = withReactContent(Swal);
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    getToDoCompleted();
  }, []);

  const getToDoCompleted = async () => {
    axios
      .get(`https://api.todoist.com/sync/v8/completed/get_all`, {
        headers: {
          Authorization: `Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258`,
        },
      })
      .then((response) => {
        setToDoList(response.data.items);
        document.title = `ToDos`;
      })
      .catch((error) => console.log(error));
  };

  const uncompleted = (id) => {
    let config = {
      method: "post",
      url: `https://api.todoist.com/rest/v1/tasks/${id}/reopen`,
      headers: {
        Authorization: "Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258",
      },
    };

    MySwal.fire({
      title: "Do you want to uncompleted task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios(config)
          .then(() => {
            getToDoCompleted();
            MySwal.fire("Uncompleted Task!", "", "success");
          })
          .catch(() => {
            MySwal.fire("Opps!", "", "error");
          });
      }
    });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row py-4">
          <h1 className="text-muted text-center">task completed</h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <ul className="list-group">
              {toDoList.map((items) => {
                return (
                  <li className="list-group-item border-0 border-bottom d-flex" key={items.id}>
                    {items.content.length >= 100 ? items.content.substring(0, 100) + "..." : items.content}
                    <div className="ms-auto">
                      <button className="btn btn-danger btn-sm" onClick={() => uncompleted(items.task_id)}>
                        Uncompleted
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Completed;
