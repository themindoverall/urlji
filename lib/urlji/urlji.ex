defmodule Urlji.Urlji do
  use Ecto.Schema
  import Ecto.Changeset

  schema "urljis" do
    field :slug, :string
    field :url, :string

    timestamps()
  end

  @spec changeset(
          {map, map}
          | %{
              :__struct__ => atom | %{:__changeset__ => map, optional(any) => any},
              optional(atom) => any
            },
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  @doc false
  def changeset(urlji, attrs) do
    urlji
    |> cast(attrs, [:slug, :url])
    |> validate_required([:slug, :url])
    |> validate_url(:url)
    |> unique_constraint(:url)
    |> unique_constraint(:slug)
  end

  defp validate_url(changeset, field) do
    validate_change changeset, field, fn _, value ->
      case URI.parse(value) do
        %URI{scheme: nil} ->
          [url: "is missing a scheme (e.g. https)"]

        %URI{host: nil} ->
          [url: "is missing a host"]

        %URI{host: ""} ->
          [url: "is missing a host"]

        %URI{scheme: scheme} ->
          if !(scheme == "http" || scheme == "https") do
            [url: "is not http or https"]
          else
            []
          end
      end
    end
  end

  def slug_taken?(%Ecto.Changeset{} = changeset) do
    case changeset.errors[:slug] do
      {_, [constraint: :unique, constraint_name: _]} -> true
      _ -> false
    end
  end
end
