import fetch from "request";

describe("Auth with admin", () => {
    it("authenticates", () => {
        fetch(`http://localhost:8080/admin/isAuth`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
            }
        }, (err, res, body) => {
            expect(body.code).toEqual(200);
        })
    });

    it("create category", () => {
        fetch(`http://localhost:8080/category/create`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
            }
        }, (err, res, body) => {
            expect(body.code).toEqual(200);
        });

        fetch(`http://localhost:8080/category/create`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
            }
        }, (err, res, body) => {
            expect(body.code).toEqual(200);
        });
    });

    it("delete category", async () => {
        fetch(`http://localhost:8080/category/delete/1`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`test:test`).toString("base64")}`
            }
        }, (err, res, body) => {
            expect(body.code).toEqual(200);
        });

    });
})