defmodule Baseapp.BlogFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Baseapp.Blog` context.
  """

  @doc """
  Generate a post.
  """
  def post_fixture(attrs \\ %{}) do
    {:ok, post} =
      attrs
      |> Enum.into(%{
        string: "some string"
      })
      |> Baseapp.Blog.create_post()

    post
  end
end
