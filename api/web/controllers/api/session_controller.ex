defmodule Sling.SessionController do
  use Sling.Web, :controller

  alias Sling.Auth.Guardian

  def create(conn, params) do
    case authenticate(params) do
      {:ok, user} ->
        new_conn = Guardian.Plug.sign_in(conn, user)
        jwt = Guardian.Plug.current_token(new_conn)

        new_conn
        |> put_status(:created)
        |> render("show.json", user: user, jwt: jwt)
      :error ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")
    end
  end

  def delete(conn, _) do
    jwt = Guardian.Plug.current_token(conn)
    case Guardian.revoke(jwt) do
      {:ok, _claims} ->
        conn
        |> put_status(:ok)
        |> render("delete.json")
      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> render("forbidden.json", error: "Something happend wrong!")
    end
  end

  def refresh(conn, _params) do

    user = Guardian.Plug.current_resource(conn)
    jwt = Guardian.Plug.current_token(conn)


    case Guardian.refresh(jwt) do
      {:ok, {_old_token, _old_claims}, {new_token, _new_claims}} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user, jwt: new_token)
      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> render("forbidden.json", error: "Not authenticated")
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(Sling.SessionView, "forbidden.json", error: "Not Authenticated")
  end

  defp authenticate(%{"email" => email, "password" => password}) do
    user = Repo.get_by(Sling.User, email: String.downcase(email))

    case check_password(user, password) do
      true -> {:ok, user}
      _ -> :error
    end
  end

  defp check_password(user, password) do
    case user do
      nil -> Comeonin.Bcrypt.dummy_checkpw()
      _ -> Comeonin.Bcrypt.checkpw(password, user.password_hash)
    end
  end
end
