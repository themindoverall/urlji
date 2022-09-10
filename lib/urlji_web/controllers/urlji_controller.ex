defmodule UrljiWeb.UrljiController do
  use UrljiWeb, :controller

  def home(conn, _params) do
    render(conn, "home.html")
  end

  def create(conn, %{"url" => url}) do
    urlji = Urlji.Shortener.convert_to_urlji(url)
    slug = String.graphemes(urlji.slug)
    json conn, %{
      original_url: urlji.url,
      url: ["http://192.168.7.24:4000"] ++ slug,
    }
  end

  def redirect_to_urlji(conn, %{"slug" => [slug]}) do
    urlji = Urlji.Shortener.find_urlji_by_slug(slug)
    redirect conn, external: urlji.url
  end
end
