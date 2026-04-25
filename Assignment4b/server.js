const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", chunk => {
            body += chunk;
            if (body.length > 1_000_000) {
                request.destroy();
                reject(new Error("Request body is too large."));
            }
        });

        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON body."));
            }
        });

        request.on("error", reject);
    });
}

function appendRecord(fileName, record) {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    const filePath = path.join(DATA_DIR, fileName);
    let records = [];

    if (fs.existsSync(filePath)) {
        const current = fs.readFileSync(filePath, "utf8").trim();
        records = current ? JSON.parse(current) : [];
    }

    const savedRecord = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...record
    };

    records.push(savedRecord);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2));

    return savedRecord;
}

function requiredFieldsArePresent(payload, fields) {
    return fields.every(field => String(payload[field] || "").trim().length > 0);
}

async function handleApi(request, response) {
    try {
        if (request.method === "POST" && request.url === "/api/bookings") {
            const payload = await readJsonBody(request);

            if (!requiredFieldsArePresent(payload, ["fullName", "email", "phone", "destination", "departure"])) {
                sendJson(response, 400, { message: "Please fill all required booking fields." });
                return;
            }

            const booking = appendRecord("bookings.json", payload);
            sendJson(response, 201, {
                message: "Booking request saved successfully.",
                booking
            });
            return;
        }

        if (request.method === "POST" && request.url === "/api/contact") {
            const payload = await readJsonBody(request);

            if (!requiredFieldsArePresent(payload, ["name", "email", "message"])) {
                sendJson(response, 400, { message: "Please fill all contact fields." });
                return;
            }

            const contactMessage = appendRecord("messages.json", payload);
            sendJson(response, 201, {
                message: "Contact message saved successfully.",
                contactMessage
            });
            return;
        }

        sendJson(response, 404, { message: "API route not found." });
    } catch (error) {
        sendJson(response, 500, { message: error.message || "Server error." });
    }
}

function serveStaticFile(request, response) {
    const requestPath = request.url === "/" ? "/index.html" : decodeURIComponent(request.url.split("?")[0]);
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(ROOT_DIR, safePath);

    if (!filePath.startsWith(ROOT_DIR)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Page not found.");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        response.writeHead(200, { "Content-Type": MIME_TYPES[extension] || "application/octet-stream" });
        response.end(content);
    });
}

const server = http.createServer((request, response) => {
    if (request.url.startsWith("/api/")) {
        handleApi(request, response);
        return;
    }

    serveStaticFile(request, response);
});

server.listen(PORT, () => {
    console.log(`Travel Booking backend is running at http://localhost:${PORT}`);
});
