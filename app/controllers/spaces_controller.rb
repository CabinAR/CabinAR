class SpacesController < ApplicationController
  before_action :authenticate_user!

  def index
    # get myspaces
    @spaces = Space.by_user(current_user)
  end


  def show
    @space = Space.by_user(current_user).find_by_id(space_id)

    return head 404 unless @space
  end

  def new
    @space = Space.new
  end

  def create
    @space = Space.create(space_params.merge(user: current_user))

    redirect_to space_path(@space.id)
  end

  protected

  def space_params
    params.require(:space).permit(:name)
  end

  def space_id
    params[:id].to_i
  end

end