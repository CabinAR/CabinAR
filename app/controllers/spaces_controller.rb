class SpacesController < ApplicationController
  before_action :authenticate_user!

  def index
    # get myspaces
    @spaces = Space.by_user(current_user)

    if @spaces.length === 0
      space = Space.create_default_for(current_user)
      redirect_to space_path(space)
    end

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

  def edit
    @space = Space.by_user(current_user).find_by_id(space_id)
    if @space.user_id != current_user.id 
      return redirect_to spaces_path
    end
    
  end


  def update
    @space = Space.by_user(current_user).find_by_id(space_id)
    @space.update(space_params)
    redirect_to spaces_path
  end

  protected

  def space_params
    params.require(:space).permit(:name,:published,:latitude,:longitude,:radius,:icon,:tagline)
  end

  def space_id
    params[:id].to_i
  end

end