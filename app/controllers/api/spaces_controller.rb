class Api::SpacesController < Api::BaseController


  def index
    spaces = if current_user
      current_user.spaces
    else
      Space.all
    end
    # if passed in a lat and lon, show those spaces, otherwise just show users space
    render json: spaces.as_json
  end


  def show
    # get a space, only a published one unless it's mine
    space = Space.published.find_by_id(params[:id].to_s)

    if !space && current_user
      space = current_user.spaces.find_by_id(params[:id].to_s)
    end

    if space
      render json: space.as_json(with_pieces: true)
    else
      head :not_found
    end

  end


end