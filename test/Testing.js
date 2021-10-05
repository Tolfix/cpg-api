const request = require("request");

// request(`http://localhost:8080/category/post/create`, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
//     },
//     body: JSON.stringify({
//         name: "Test",
//         description: "test"
//     })
// }, (err, res, body) => {
//     console.log(body)
// });
request(`http://localhost:8080/admin/post/auth`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Buffer.from(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW4iLCJleHAiOjE2MzQwNTg1MDgsImlhdCI6MTYzMzQ1MzcwOH0.V1_5smR3i-ctgj1Mw2xWk5VaWJlNJpxrMTDEk8V9EYE`).toString("base64")}`
    },
}, (err, res, body) => {
    console.log(body)
});
// request(`http://localhost:8080/category/delete/3`, {
//     method: "DELETE",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
//     },
// }, (err, res, body) => {
//     console.log(body);
//         request(`http://localhost:8080/category/post/create`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
//             },
//             body: JSON.stringify({
//                 name: "Test",
//                 description: "test"
//             })
//         }, (err, res, body) => {
//             console.log(body)
//         });
// });