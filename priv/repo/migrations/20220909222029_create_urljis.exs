defmodule Urlji.Repo.Migrations.CreateUrljis do
  use Ecto.Migration

  def change do
    create table(:urljis) do
      add :slug, :string, size: 32, null: false
      add :url, :string, size: 2048, null: false

      timestamps()
    end

    create index(:urljis, [:slug], unique: true)
    create index(:urljis, [:url], unique: true)
  end
end
