defmodule UrljiWeb.Router do
  use UrljiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {UrljiWeb.LayoutView, :root}
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", UrljiWeb do
    pipe_through :browser

    get "/", UrljiController, :home

    get "/*slug", UrljiController, :redirect_to_urlji
  end

  scope "/", UrljiWeb do
    pipe_through :api

    post "/urlji", UrljiController, :create
  end
  # Other scopes may use custom stacks.
  # scope "/api", UrljiWeb do
  #   pipe_through :api
  # end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
