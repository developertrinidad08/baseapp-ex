defmodule Baseapp.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :string, :text

      timestamps(type: :utc_datetime)
    end
  end
end
