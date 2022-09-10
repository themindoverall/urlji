defmodule UrljiWeb.UrljiController do
  use UrljiWeb, :controller

  alias UrljiWeb.FallbackController

  action_fallback FallbackController

  def home(conn, _params) do
    render(conn, "home.html")
  end

  def create(conn, %{"url" => url}) do
    case Urlji.Shortener.convert_to_urlji(url) do
      {:ok, urlji} ->
        slug = String.graphemes(urlji.slug)
        json conn, %{
          original_url: urlji.url,
          url: [current_base_url()] ++ slug,
        }
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(400)
        |> json(%{
            errors: Ecto.Changeset.traverse_errors(changeset, fn {msg, _} -> msg end)
          })
    end
  end

  def redirect_to_urlji(conn, %{"slug" => [slug]}) do
    case Urlji.Shortener.find_urlji_by_slug(slug) do
      %{url: url} -> redirect conn, external: url
      _ -> {:error, :not_found}
    end
  end

  defp current_base_url() do
    cur_uri  = UrljiWeb.Endpoint.struct_url()

    UrljiWeb.Router.Helpers.url(cur_uri)
  end
end
