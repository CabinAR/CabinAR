class Api::SpacesController < Api::BaseController


  def index
    render json: current_user.spaces.as_json
  end


  def show
    space = current_user.spaces.find_by_id(params[:id].to_s)

    if space
      render json: space.as_json(with_pieces: true)
    else
      head :not_found
    end

  end


end