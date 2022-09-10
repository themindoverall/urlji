check:
	elixir --version
	node --version
	docker-compose --version

setup:
	npm install --prefix assets
	docker-compose up -d
	mix setup

server:
	mix phx.server

.PHONY: test
test:
	mix test
