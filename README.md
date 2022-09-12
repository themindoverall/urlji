# Urlji

[urlji.webm](https://user-images.githubusercontent.com/122677/189708994-0d6e115e-1825-4c90-b8c8-70a75ef08000.webm)

To start the app:
  * Have Erlang, Elixir, Node.js, Docker, and Docker-Compose installed
  * Use `make check` to do a basic check of your local environment. If it fails, it's probably because something isn't installed. If your docker compose is `docker compose` instead of `docker-compose` then update those references in the Makefile.
  * Install dependencies and initialize database with `make setup`
  * Start Phoenix endpoint with `make server`
  * Run tests with `make test`

You can override config by creating a `config/config.local.exs` file. This file is gitignored.

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).
