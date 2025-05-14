defmodule Baseapp.Repo do
  use Ecto.Repo,
    otp_app: :baseapp,
    adapter: Ecto.Adapters.Postgres
end
