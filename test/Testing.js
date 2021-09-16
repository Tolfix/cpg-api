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
request(`http://localhost:8080/category/post/create`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
    },
    body: JSON.stringify({
        name: "Test",
        description: "test"
    })
}, (err, res, body) => {
    console.log(body)
});
request(`http://localhost:8080/category/delete/3`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
    },
}, (err, res, body) => {
    console.log(body);
        request(`http://localhost:8080/category/post/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
            },
            body: JSON.stringify({
                name: "Test",
                description: "test"
            })
        }, (err, res, body) => {
            console.log(body)
        });
});