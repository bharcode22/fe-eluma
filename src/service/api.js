import axios from "axios";

const Api = axios.create({
    // baseURL: "https://backend-api-821675735524.asia-southeast2.run.app",
    baseURL: "http://localhost:3000",
});

export default Api;
