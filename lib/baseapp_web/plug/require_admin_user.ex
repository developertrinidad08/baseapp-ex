defmodule BaseappWeb.Plugs.RequireAdminUser do
  use BaseappWeb, :controller

  def init(opts), do: opts

  def call(conn, _opts) do

    user = conn.assigns[:current_user]

    if user && user.role == "admin" do
      conn
    else
      conn 
      |> put_flash(:error, "no tiene permiso para acceder a esto")
      |> redirect(to: "/")
      |> halt()
    end
  end
end
