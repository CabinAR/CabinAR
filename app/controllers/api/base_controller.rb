class Api::BaseController < ApplicationController 
  skip_before_action :verify_authenticity_token
  before_action :check_token

  def check_token
    @api_key = params[:api_key].presence
    user = User.find_by_api_token(@api_key) if @api_key
 
    if user 
      sign_in user, store: false
    end
  end

end