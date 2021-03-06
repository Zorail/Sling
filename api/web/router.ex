defmodule Sling.Router do
  use Sling.Web, :router

  # alias Sling.Auth.Guardian
  pipeline :api do
    plug :accepts, ["json"]
    plug Sling.Auth.Pipeline
  end

  pipeline :guest_pipeline do
    plug Guardian.Plug.LoadResource, allow_blank: true
  end

  pipeline :login_required do
    plug Guardian.Plug.EnsureAuthenticated
  end

  scope "/api", Sling do
    pipe_through [:guest_pipeline]
    post "/users", UserController, :create
    post "/sessions", SessionController, :create

    # scope "/" do
      pipe_through [:api, :login_required]
      delete "/sessions", SessionController, :delete
      post "/sessions/refresh", SessionController, :refresh
      get "/users/:id/rooms", UserController, :rooms
      resources "/rooms", RoomController, only: [:index, :create] do
        resources "/messages", MessageController, only: [:index]
      end
      post "/rooms/:id/join", RoomController, :join
    # end
  end


end
