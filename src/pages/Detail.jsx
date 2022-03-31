import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { v4 as uuid } from "uuid";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Detail = () => {
  let titleTask = React.createRef();
  let descriptionTask = React.createRef();
  const MySwal = withReactContent(Swal);
  const params = useParams();
  const [toDoDetail, setToDo] = useState([]);
  const [readyPage, setReadyPage] = useState(false);
  const unique_id = uuid();

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = async () => {
    const { id } = params;
    axios
      .get(`https://api.todoist.com/rest/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer 0c5227a0fed2841ab55e88f757bbf168a79a2258`,
        },
      })
      .then((response) => {
        setToDo(response.data);
        setReadyPage(true);
      })
      .catch((error) => console.log(error));
  };

  const updateToDo = () => {
    const { id } = params;
    let data = JSON.stringify({
      content: titleTask.current.value,
      description: descriptionTask.current.value,
    });

    // console.log(data);

    let config = {
      method: "post",
      url: `https://api.todoist.com/rest/v1/tasks/${id}`,
      headers: {
        "X-Request-Id": { unique_id },
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
            text: "Update Task!",
            icon: "success",
          });
          getTodo();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          {readyPage ? (
            <div className="col-lg">
              <div className="mb-3">
                <input type="text" className="form-control border-0 border-bottom" id="addTask" ref={titleTask} defaultValue={toDoDetail.content} placeholder="Title Task..." />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control border-0 border-bottom" id="addDesc" ref={descriptionTask} defaultValue={toDoDetail.description} placeholder="Description..." />
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={() => updateToDo()}>
                  Update Task
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
