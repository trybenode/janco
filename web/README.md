# JANCO Customer and Janitor PWA

This is the dedicated Next.js PWA for customers and janitors. The Expo app remains supported; both clients use the FastAPI backend as the source of truth for authentication, pricing, bookings, payments, dispatch, chat, verification, and ratings.

## Local development

```bash
npm ci
npm run dev -- -p 3001
```

Set `NEXT_PUBLIC_API_URL` to the backend `/v1` URL and `NEXT_PUBLIC_VAPID_PUBLIC_KEY` to the public Web Push key when browser notifications are enabled. In local development the default API is `http://localhost:8000/v1`; the development Content Security Policy permits HTTP and WebSocket connections to `localhost:8000` and `127.0.0.1:8000`. Production only permits HTTPS and secure WebSockets, so configure the deployed API URL with HTTPS.

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The lockfile is committed so CI and deploys use the same Next.js version. The backend test suite is run from the repository root with the development requirements installed.

The application uses a centered 430px mobile canvas to preserve the Expo visual system on desktop. The service worker caches the public shell and previously opened reads; booking creation, payment initialization, cancellation, and other unsafe mutations remain online-only.

## Deployment

Deploy this app separately from the API and admin surface with HTTPS enabled. Configure `NEXT_PUBLIC_API_URL` per environment, add the deployed origin to the backend `CORS_ORIGINS`, and verify the manifest, service worker, Paystack callback URL, and `/health` monitoring before enabling production traffic.


remove any text relating to spakler or spaklers 

margin between section cards 

buttons should be spaced between when they are 2  and centralised when it is 1

progresive step in book a service page should be centralized on page 

extras didn't count to final price 

headers and back button should be inline 

profile page should exactly mirror profile page from mobile app

when an account with janitor stastus login, they should be navigated and authenticated to their janitors dashbaord 

home page should also exactly mirror mobil app home page 

update terms and service to be served fromn backend directly and include a logout button 

Jannitors dashboard should completelltey mirror flow from mobile app (in fornt end )

avoide showing vague error messages to users instead use user friednly error message 

a proper loader that enhances user experience should be implmented instead of (Loading your secure workplace))

a bottom. nav bar on janitors page



INFO:     127.0.0.1:51830 - "PATCH /v1/auth/notification-preferences HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application

+ Exception Group Traceback (most recent call last):
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 81, in collapse_excgroups
  |     yield
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 192, in __call__
  |     async with anyio.create_task_group() as task_group:
  |                ~~~~~~~~~~~~~~~~~~~~~~~^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/anyio/_backends/_asyncio.py", line 783, in __aexit__
  |     raise BaseExceptionGroup(
  |         "unhandled errors in a TaskGroup", self._exceptions
  |     ) from None
  | ExceptionGroup: unhandled errors in a TaskGroup (1 sub-exception)
  +-+---------------- 1 ----------------
  | Traceback (most recent call last):
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/uvicorn/protocols/http/h11_impl.py", line 410, in run_asgi
  |     result = await app(  # type: ignore[func-returns-value]
  |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |         self.scope, self.receive, self.send
  |         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |     )
  |     ^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/uvicorn/middleware/proxy_headers.py", line 60, in __call__
  |     return await self.app(scope, receive, send)
  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/applications.py", line 1160, in __call__
  |     await super().__call__(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/applications.py", line 107, in __call__
  |     await self.middleware_stack(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/errors.py", line 186, in __call__
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/errors.py", line 164, in __call__
  |     await self.app(scope, receive, _send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
  |     with recv_stream, send_stream, collapse_excgroups():
  |                                    ~~~~~~~~~~~~~~~~~~^^
  |   File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
  |     self.gen.throw(value)
  |     ~~~~~~~~~~~~~~^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
  |     response = await self.dispatch_func(request, call_next)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/main.py", line 174, in csrf_protection
  |     return await call_next(request)
  |            ^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
  |     await self.app(scope, receive_or_disconnect, send_no_error)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
  |     with recv_stream, send_stream, collapse_excgroups():
  |                                    ~~~~~~~~~~~~~~~~~~^^
  |   File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
  |     self.gen.throw(value)
  |     ~~~~~~~~~~~~~~^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
  |     response = await self.dispatch_func(request, call_next)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/main.py", line 144, in security_headers
  |     response = await call_next(request)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
  |     await self.app(scope, receive_or_disconnect, send_no_error)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
  |     with recv_stream, send_stream, collapse_excgroups():
  |                                    ~~~~~~~~~~~~~~~~~~^^
  |   File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
  |     self.gen.throw(value)
  |     ~~~~~~~~~~~~~~^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
  |     response = await self.dispatch_func(request, call_next)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/middleware/logging_middleware.py", line 69, in dispatch
  |     response = await call_next(request)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
  |     await self.app(scope, receive_or_disconnect, send_no_error)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
  |     with recv_stream, send_stream, collapse_excgroups():
  |                                    ~~~~~~~~~~~~~~~~~~^^
  |   File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
  |     self.gen.throw(value)
  |     ~~~~~~~~~~~~~~^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
  |     response = await self.dispatch_func(request, call_next)
  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/middleware/rate_limiter.py", line 137, in dispatch
  |     return await call_next(request)
  |            ^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
  |     await self.app(scope, receive_or_disconnect, send_no_error)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/cors.py", line 95, in __call__
  |     await self.simple_response(scope, receive, send, request_headers=headers)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/cors.py", line 153, in simple_response
  |     await self.app(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/exceptions.py", line 63, in __call__
  |     await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
  |     await app(scope, receive, sender)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/middleware/asyncexitstack.py", line 18, in __call__
  |     await self.app(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 716, in __call__
  |     await self.middleware_stack(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 736, in app
  |     await route.handle(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 290, in handle
  |     await self.app(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 130, in app
  |     await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
  |     raise exc
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
  |     await app(scope, receive, sender)
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 116, in app
  |     response = await f(request)
  |                ^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 670, in app
  |     raw_response = await run_endpoint_function(
  |                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |     ...<3 lines>...
  |     )
  |     ^
  |   File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 324, in run_endpoint_function
  |     return await dependant.call(**values)
  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/routes/auth_routes.py", line 174, in update_notification_preferences
  |     return await user_repo.update_notification_preferences(user_id, updates)
  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/repositories/user_repo.py", line 189, in update_notification_preferences
  |     current = await get_notification_preferences(user_id)
  |               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |   File "/Users/user/IT/janco/backend/app/repositories/user_repo.py", line 185, in get_notification_preferences
  |     return dict(row or {"booking": True, "assignment": True, "status": True, "chat": True, "payment": True, "reminders": True})
  | ValueError: dictionary update sequence element #0 has length 1; 2 is required
  +------------------------------------

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/uvicorn/protocols/http/h11_impl.py", line 410, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        self.scope, self.receive, self.send
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/uvicorn/middleware/proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/applications.py", line 1160, in __call__
    await super().__call__(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/applications.py", line 107, in __call__
    await self.middleware_stack(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/errors.py", line 186, in __call__
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
    with recv_stream, send_stream, collapse_excgroups():
                                   ~~~~~~~~~~~~~~~~~~^^
  File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
    self.gen.throw(value)
    ~~~~~~~~~~~~~~^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
    response = await self.dispatch_func(request, call_next)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/main.py", line 174, in csrf_protection
    return await call_next(request)
           ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
    raise app_exc from app_exc.__cause__ or app_exc.__context__
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
    await self.app(scope, receive_or_disconnect, send_no_error)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
    with recv_stream, send_stream, collapse_excgroups():
                                   ~~~~~~~~~~~~~~~~~~^^
  File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
    self.gen.throw(value)
    ~~~~~~~~~~~~~~^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
    response = await self.dispatch_func(request, call_next)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/main.py", line 144, in security_headers
    response = await call_next(request)
               ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
    raise app_exc from app_exc.__cause__ or app_exc.__context__
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
    await self.app(scope, receive_or_disconnect, send_no_error)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
    with recv_stream, send_stream, collapse_excgroups():
                                   ~~~~~~~~~~~~~~~~~~^^
  File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
    self.gen.throw(value)
    ~~~~~~~~~~~~~~^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
    response = await self.dispatch_func(request, call_next)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/middleware/logging_middleware.py", line 69, in dispatch
    response = await call_next(request)
               ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
    raise app_exc from app_exc.__cause__ or app_exc.__context__
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
    await self.app(scope, receive_or_disconnect, send_no_error)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 191, in __call__
    with recv_stream, send_stream, collapse_excgroups():
                                   ~~~~~~~~~~~~~~~~~~^^
  File "/opt/homebrew/Cellar/python@3.14/3.14.2/Frameworks/Python.framework/Versions/3.14/lib/python3.14/contextlib.py", line 162, in __exit__
    self.gen.throw(value)
    ~~~~~~~~~~~~~~^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 193, in __call__
    response = await self.dispatch_func(request, call_next)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/middleware/rate_limiter.py", line 137, in dispatch
    return await call_next(request)
           ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 168, in call_next
    raise app_exc from app_exc.__cause__ or app_exc.__context__
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/base.py", line 144, in coro
    await self.app(scope, receive_or_disconnect, send_no_error)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/cors.py", line 95, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/cors.py", line 153, in simple_response
    await self.app(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/middleware/exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/middleware/asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 130, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 116, in app
    response = await f(request)
               ^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 670, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/Users/user/IT/janco/backend/venv/lib/python3.14/site-packages/fastapi/routing.py", line 324, in run_endpoint_function
    return await dependant.call(**values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/routes/auth_routes.py", line 174, in update_notification_preferences
    return await user_repo.update_notification_preferences(user_id, updates)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/repositories/user_repo.py", line 189, in update_notification_preferences
    current = await get_notification_preferences(user_id)
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/user/IT/janco/backend/app/repositories/user_repo.py", line 185, in get_notification_preferences
    return dict(row or {"booking": True, "assignment": True, "status": True, "chat": True, "payment": True, "reminders": True})
ValueError: dictionary update sequence element #0 has length 1; 2 is required
