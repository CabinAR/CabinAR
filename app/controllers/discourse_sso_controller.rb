class DiscourseSsoController < ApplicationController
  before_action :authenticate_user!

  def sso
    secret = ENV['FORUM_SECRET']
    sso = SingleSignOn.parse(request.query_string, secret)
    sso.email = current_user.email
    sso.name = current_user.email
    sso.username = current_user.email
    sso.external_id = current_user.id
    sso.sso_secret = secret

    redirect_to sso.to_url("https://forum.cabin-ar.com/session/sso_login")
  end
end