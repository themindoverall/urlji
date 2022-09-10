check:
	elixir --version
	node --version
	docker-compose --version

setup:
	mix deps.get
	npm install --prefix assets
	docker-compose up -d
	mix ecto.create

server:
	mix phx.server

.PHONY: test
test:
	mix test
