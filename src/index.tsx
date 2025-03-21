import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { html, raw } from "hono/html";

const app = new Hono();

// custom 404
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

// custom error
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

// middleware basic auth
app.use(
  "/admin/*",
  basicAuth({
    username: "admin",
    password: "secret",
  })
);

app.get("/admin", (c) => {
  return c.text("You are authorized!");
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// json response
app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

// query and params
app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

// post, put, patch, delete
app.post("/posts", (c) => c.text("Created!", 201));
app.put("/posts/:id", (c) => c.text(`${c.req.param("id")} is updated put!`));
app.patch("/posts/:id", (c) =>
  c.text(`${c.req.param("id")} is updated patch!`)
);
app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));

// html response
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
        <p>
          <a href="page">API</a>
        </p>
      </body>
    </html>
  );
};

app.get("/page", (c) => {
  return c.html(<View />);
});

// raw response
app.get("/raw", () => {
  return new Response("Good morning!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
