const axios = require('axios');
const qs = require('qs');


const hostname = process.env.HOSTNAME ;
const controller = "validate";
const action = "check";

const requestUrl = `http://${hostname}/${controller}/${action}`;

const postParameters = {
    user: "username@realmname",
    pass: "generated_otp", 
    // realm: "realmname"
};
axios.post(requestUrl, qs.stringify(postParameters), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
    .then(response => {
        const data = response.data;
        if (data.result && data.result.value === true) {
            console.log("authenticated");
        } else {
            console.log("not authenticated");
        }
        console.log(data);
    })
    .catch(error => {
        if (error.response) {
            console.error("Server responded with error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error creating request:", error.message);
        }
    });








