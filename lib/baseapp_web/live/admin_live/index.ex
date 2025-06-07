defmodule BaseappWeb.AdminLive.Index do
  use BaseappWeb, :live_view
  alias Baseapp.Accounts

  import Ecto.Query, warn: false
  alias Baseapp.Repo

  alias Baseapp.Accounts.User
  
  @page_size 2

  def mount(_params, _session, socket) do
    columnas = [
      %{title: "ID", field: "id", sorter: "number"},
      %{title: "Email", field: "email", sorter: "string"},
      %{title: "Rol", field: "role", sorter: "string"}
    ]

    filtros = %{}
    orden = nil
    pagina = 1

    {rows, total} = fetch_data(filtros, orden, pagina)

    {:ok,
     assign(socket,
       columns: columnas,
       rows: rows,
       total: total,
       pagina: pagina,
       filtros: filtros,
       orden: orden,
       page_size: @page_size
     )}
  end

  def handle_event("aplicar_filtros", %{"filtros" => filtros_params, "orden" => orden_params}, socket) do
    # Convertimos filtros y descartamos vacíos
    filtros = filtros_params
      |> Enum.reject(fn {_k,v} -> v in [nil, ""] end)
      |> Map.new(fn {k,v} -> {String.to_atom(k), v} end)

    orden =
      case orden_params do
        %{"campo" => campo, "direccion" => dir} -> %{"campo" => campo, "direccion" => dir}
        _ -> nil
      end

    pagina = 1

    {rows, total} = fetch_data(filtros, orden, pagina)

    # IMPORTANTE: si total = 0 y filtros no está vacío, igual devolvemos el resultado vacío sin errores
    # Tabulator lo maneja bien ahora con el hook modificado

    {:noreply,
     assign(socket,
       rows: rows,
       total: total,
       pagina: pagina,
       filtros: filtros,
       orden: orden
     )}
  end

  def handle_event("pagina", %{"num" => num_str}, socket) do
    num = String.to_integer(num_str)
    {rows, total} = fetch_data(socket.assigns.filtros, socket.assigns.orden, num)

    {:noreply,
     assign(socket,
       rows: rows,
       pagina: num,
       total: total
     )}
  end

  defp fetch_data(filtros, orden, pagina) do
    query = from u in User

    filtros_limpios = filtros |> Enum.filter(fn {_k, v} -> v not in [nil, ""] end)

    query =
      Enum.reduce(filtros_limpios, query, fn
        {:email, val}, query when val != "" ->
          from u in query, where: ilike(u.email, ^"%#{val}%")

        {:role, val}, query when val != "" ->
          from u in query, where: ilike(u.role, ^"%#{val}%")
      
        {:id, val}, query when val != "" ->
          from u in query, where: u.id == ^val

        _, query ->
          query
      end)

    query = maybe_order(query, orden)

    total = Repo.aggregate(query, :count, :id)

    query = from u in query,
      limit: ^@page_size,
      offset: ^((pagina - 1) * @page_size)

    rows = Repo.all(query)

    rows = Enum.map(rows, fn r ->
      %{
        id: r.id,
        email: r.email,
        role: r.role
      }
    end)

    {rows, total}
  end

  defp maybe_order(query, %{"campo" => campo, "direccion" => dir}) when campo != nil do
    field = String.to_existing_atom(campo)

    case dir do
      "asc" -> from u in query, order_by: [{:asc, field(u, ^field)}]
      "desc" -> from u in query, order_by: [{:desc, field(u, ^field)}]
      _ -> query
    end
  end

  defp maybe_order(query, _), do: query
end



