defmodule Urlji.Shortener do
  @moduledoc """
  The Shortener context.
  """

  import Ecto.Query, warn: false

  alias Urlji.Emoji

  alias Urlji.Repo

  alias Urlji.Urlji

  def convert_to_urlji(url) do
    {:ok, record} = insert_urlji(url)
    if is_nil(record.id) do
      Repo.one(
        from(urlji in Urlji, where: urlji.url == ^url)
      )
    else
      record
    end
  end
  def find_urlji_by_slug(slug) do
    Repo.one(
      from(urlji in Urlji, where: urlji.slug == ^slug)
    )
  end

  defp insert_urlji(url) do
    slug = generate_slug()

    insert_result = %Urlji{}
      |> Urlji.changeset(%{
        url: url,
        slug: slug,
      })
      |> Repo.insert(conflict_target: :url, on_conflict: :nothing)

    case insert_result do
      {:error, error} ->
        if Urlji.slug_taken?(error) do
          # TODO: cap how many times this can repeat
          insert_urlji(url)
        else
          {:error, error}
        end
      _ ->
        insert_result
    end
  end

  defp generate_slug() do
    0..2
    |> Enum.map(fn _ -> Emoji.random_emoji end)
    |> Enum.join("")
  end
end
