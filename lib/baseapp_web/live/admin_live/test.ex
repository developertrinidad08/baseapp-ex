defmodule Baseapp.Accounts.TestUserGenerator do
  alias Baseapp.Accounts

  @doc """
  Genera `count` usuarios de prueba con el nombre base `base_name`.

  Cada usuario tendrá:
    - Email: base_name1@testing.com, base_name2@testing.com, etc.
    - Password: "password123"
  """
  def generate_users(base_name \\ "nombre", count \\ 100) do
    Enum.each(1..count, fn i ->
      email = "#{base_name}#{i}@testing.com"
      password = "password123"

      Accounts.register_user(%{
        email: email,
        password: password,
        password_confirmation: password
      })
    end)
  end
end

