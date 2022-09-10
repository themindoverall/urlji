defmodule Urlji.Repo do
  use Ecto.Repo,
    otp_app: :urlji,
    adapter: Ecto.Adapters.Postgres
end
