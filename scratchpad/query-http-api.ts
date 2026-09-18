// Run: node scratchpad/query-http-api.ts
// Scalar: http://127.0.0.1:3000/docs
// Scalar (CDN): http://127.0.0.1:3000/docs-cdn
// Swagger UI: http://127.0.0.1:3000/docs-swagger
// OpenAPI: http://127.0.0.1:3000/openapi.json
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Schema } from "effect"
import { HttpRouter } from "effect/unstable/http"
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiScalar,
  HttpApiSwagger
} from "effect/unstable/httpapi"
import { createServer } from "node:http"

const Api = HttpApi.make("QueryExample").add(
  HttpApiGroup.make("fruits").add(
    HttpApiEndpoint.query("search", "/search", {
      payload: Schema.Struct({ term: Schema.String }),
      success: Schema.Array(Schema.String)
    })
  )
)

const Handlers = HttpApiBuilder.group(
  Api,
  "fruits",
  (handlers) =>
    handlers.handle("search", ({ payload }) =>
      Effect.succeed(
        ["apple", "apricot", "banana", "pear"].filter((fruit) => fruit.includes(payload.term.toLowerCase()))
      ))
)

const Routes = Layer.mergeAll(
  HttpApiBuilder.layer(Api, { openapiPath: "/openapi.json" }).pipe(Layer.provide(Handlers)),
  HttpApiScalar.layer(Api),
  HttpApiScalar.layerCdn(Api, { path: "/docs-cdn", version: "1.69.0" }),
  HttpApiSwagger.layer(Api, { path: "/docs-swagger" })
)

HttpRouter.serve(Routes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { host: "127.0.0.1", port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain
)
