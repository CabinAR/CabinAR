class Api::PiecesController < Api::BaseController
  # Pieces are only for users who are logged in


  before_action :get_piece, only: [ :show, :update, :destroy ]


  def index
    if space
      render json: space.items.as_json
    else
      head 404
    end
  end


  def show
    render json: @piece.to_builder.attributes! 
  end

  def create
    return head 404 unless space

    if !space.locked? || current_user.admin_for?(space)
      @piece = current_user.pieces.create(space_id: space.id, marker_units: "inches", marker_width: 12 )
      render json: @piece.to_builder.attributes! 
    else
      head 404
    end
  end


  def update
    if !@piece.space.locked? || current_user.admin_for?(@piece.space)
      @piece.update(piece_params)
    end

    SpaceUpdatesChannel.broadcast_to(@piece.space, { update: "piece", data: @piece.to_builder.attributes! })

    render json: @piece.to_builder.attributes! 
  end


  def destroy
    if !@piece.space.locked? || current_user.admin_for?(@piece.space)
      @piece.destroy 
      render json: @piece.as_json 
    else
      head 404
    end
  end


  protected

  def piece_params
    params.require(:piece).permit(:name, :marker_units, :marker_width, :code, :scene, :assets, :marker)
  end

  def get_piece
    @piece = Piece.where(space_id: current_user.space_ids).find_by_id(params[:id].to_i)
    head :not_found unless @piece
  end


  def space
    @space ||= Space.by_user(current_user).find_by_id((params[:id] || params[:space_id]).to_i)
  end

end