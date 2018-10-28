defmodule Sling.GuardianSerializer do
  use Guardian, otp_app: :sling

  def subject_for_token(resource, _claims) do
    IO.puts "In subject for token"
    IO.inspect(resource)
    {:ok, to_string(resource.id)}
  end

  def resource_from_claims(claims) do
    {:ok, %{id: claims["sub"]}}
  end
end
