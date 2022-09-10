defmodule Urlji.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Urlji.Repo,
      # Start the Telemetry supervisor
      UrljiWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Urlji.PubSub},
      # Start the Endpoint (http/https)
      UrljiWeb.Endpoint
      # Start a worker by calling: Urlji.Worker.start_link(arg)
      # {Urlji.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Urlji.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    UrljiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
