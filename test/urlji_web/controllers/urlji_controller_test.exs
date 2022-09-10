defmodule UrljiWeb.UrljiControllerTest do
  use UrljiWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "<div id=\"app\">"
  end

  test "POST /urlji and GET /{slug}", %{conn: conn} do
    conn = post(conn, "/urlji", %{url: "http://asdf.co"})
    %{"url" => [_base_url | slug]} = json_response(conn, 200)

    conn = get(conn, "/#{Enum.join(slug, "")}")
    assert redirected_to(conn) == "http://asdf.co"
  end

  test "POST /urlji same url gets same slug", %{conn: conn} do
    conn = post(conn, "/urlji", %{url: "http://asdf.co"})
    %{"url" => [_base_url | slug]} = json_response(conn, 200)

    conn = post(conn, "/urlji", %{url: "http://asdf.co"})
    %{"url" => [_base_url | slug2]} = json_response(conn, 200)

    assert(slug == slug2)
  end


  test "GET /{slug} 404", %{conn: conn} do
    conn = get(conn, "/000")
    assert html_response(conn, 404)
  end
end
