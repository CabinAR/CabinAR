class Api::LoginsController < Api::BaseController


  def show
    if current_user
      render json: current_user.to_builder.attributes! 
    else
      render json: { error: "Invalid Key" }
    end
  end


  def create
    show
  end


end