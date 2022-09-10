defmodule UrljiWeb.FallbackController do
  use UrljiWeb, :controller

  alias UrljiWeb.ErrorView

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(ErrorView)
    |> render(:"404")
  end
end
