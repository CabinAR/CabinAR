class Api::SpacesController < Api::BaseController


  def index

    spaces = []
    if current_user
      spaces += Space.by_user(current_user)
    end

    if params[:latitude].present? && params[:longitude].present?
      spaces += Space.published_nearby_to(params[:longitude].to_f,
                                        params[:latitude].to_f)
    end

    spaces = spaces.uniq.sort_by { |s| s.name }
    render json: spaces.as_json(for_user: current_user)
  end


  def show
    # get a space, only a published one unless it's mine
    space = Space.published.find_by_id(params[:id].to_s)

    if !space && current_user
      space = Space.by_user(current_user).find_by_id(params[:id].to_s)
    end

    if space
      render json: space.as_json(with_pieces: true, for_user: current_user)
    else
      head :not_found
    end

  end



end