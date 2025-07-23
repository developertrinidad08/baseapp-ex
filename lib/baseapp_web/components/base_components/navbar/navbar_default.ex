defmodule BaseappWeb.NavbarDefaultComponent do
  use Phoenix.Component
  use Phoenix.VerifiedRoutes,
    endpoint: BaseappWeb.Endpoint,
    router: BaseappWeb.Router,
    statics: BaseappWeb.static_paths()

  def navbar(assigns) do
    assigns =
      assigns
      |> assign_new(:title, fn -> "BaseApp" end)
      |> assign_new(:current_user, fn -> nil end)


    ~H"""
      <div class="flex items-center justify-between border-b border-zinc-100 py-3 text-sm">
        <div class="flex items-center gap-4">
          <a href="/">
            <img src={~p"/images/logo.svg"} width="36" />
          </a>
          <p class="bg-brand/5 text-brand rounded-full px-2 font-medium leading-6">
            v<%= Application.spec(:phoenix, :vsn) %>
          </p>
        </div>
        <div class="flex items-center gap-4 font-semibold leading-6 text-zinc-900">
          <a href="https://twitter.com/elixirphoenix" class="hover:text-zinc-700">
            @elixirphoenix
          </a>
          <a href="https://github.com/phoenixframework/phoenix" class="hover:text-zinc-700">
            GitHub
          </a>
          <a
            href="https://hexdocs.pm/phoenix/overview.html"
            class="rounded-lg bg-zinc-100 px-2 py-1 hover:bg-zinc-200/80"
          >
            Get Started <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    """
  end
end

