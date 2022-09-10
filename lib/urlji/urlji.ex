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
    |> unique_constraint(:url)
    |> unique_constraint(:slug)
  end

  def slug_taken?(%Ecto.Changeset{} = changeset) do
    case changeset.errors[:slug] do
      {_, [constraint: :unique, constraint_name: _]} -> true
      _ -> false
    end
  end
end
