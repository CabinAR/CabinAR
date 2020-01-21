class SpacesController < ApplicationController
  before_action :authenticate_user!

  def index
    # get myspaces
    @spaces = Space.by_user(current_user)

    if @spaces.length === 0 && current_user.created_at > 1.day.ago
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
    @space.create_default_piece

    redirect_to space_path(@space.id)
  end

  def edit
    @space = Space.by_user(current_user).find_by_id(space_id)
    if !current_user.admin_for?(@space)
      return redirect_to spaces_path
    end
    
  end

  def destroy
    @space = Space.by_user(current_user).find_by_id(space_id)
    if current_user.admin_for?(@space)
      @space.destroy
    end
    return redirect_to spaces_path
  end


  def update
    @space = Space.by_user(current_user).find_by_id(space_id)
    if current_user.admin_for?(@space)
      @space.update(space_params)
    end
    redirect_to spaces_path
  end


  protected

  def space_params
    params.require(:space).permit(:name,:published,:locked, :latitude,:longitude,:radius,:icon,:tagline)
  end

  def space_id
    params[:id].to_i
  end

end