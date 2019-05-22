class UserSpacesController < ApplicationController
  before_action :authenticate_user!

  before_action :get_space

  def index
  end

  def create
    user_space = @space.user_spaces.create(user_space_params)

    if !user_space.valid?
      flash[:user_space_errors] = user_space.errors.full_messages.join("\n")
    end


    redirect_to space_user_spaces_path(@space)
  end

  def destroy
    user_space = @space.user_spaces.find(params[:id].to_i)
    user_space.destroy
    redirect_to space_user_spaces_path(@space)
  end



  protected 

  def get_space
    @space = current_user.spaces.find_by_id(params[:space_id].to_i)
    head 404 unless @space
  end


  def user_space_params
    params.require(:user_space).permit(:email)
  end

end