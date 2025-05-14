defmodule Baseapp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      BaseappWeb.Telemetry,
      Baseapp.Repo,
      {DNSCluster, query: Application.get_env(:baseapp, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Baseapp.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Baseapp.Finch},
      # Start a worker by calling: Baseapp.Worker.start_link(arg)
      # {Baseapp.Worker, arg},
      # Start to serve requests, typically the last entry
      BaseappWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Baseapp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    BaseappWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
