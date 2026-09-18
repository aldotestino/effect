---
"effect": patch
"@effect/openapi-generator": patch
---

Add the safe, idempotent HTTP `QUERY` method with request-body support to `HttpApiEndpoint`, `HttpRouter`, `HttpClientRequest`, and `HttpClient`. Default CORS middleware now allows `QUERY`.

`OpenApi.fromApi` emits OpenAPI 3.2.0 when an included endpoint uses `QUERY`, and continues to emit 3.1.0 for other APIs. Update the embedded Swagger UI to 5.32.15 to display and execute these operations.

### Breaking changes

`HttpMethod` now includes `"QUERY"`, and `HttpClient.With` has a required `query` method. Update exhaustive method matches and hand-written client implementations; clients built with `HttpClient.make` receive the method automatically.

`OpenAPISpec.openapi` is now `"3.1.0" | "3.2.0"`. Consumers that require the 3.1.0 literal must handle the additional version. `OpenAPISpecMethodName` also includes `"query"`.

The OpenAPI generator accepts both the OpenAPI 3.1 `x-oai-additionalOperations` extension and the native OpenAPI 3.2 `query` field.
