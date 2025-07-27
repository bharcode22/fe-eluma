import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:3002",
    // baseURL: "http://194.233.88.134:3002",
});

export default Api;
