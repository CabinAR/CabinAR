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
    @piece = current_user.pieces.create(space_id: space.id, marker_units: "inches", marker_width: 12 )
    render json: @piece.to_builder.attributes! 
  end


  def update
    @piece.update(piece_params)

    SpaceUpdatesChannel.broadcast_to(@piece.space, { update: "piece", data: @piece.to_builder.attributes! })

    render json: @piece.to_builder.attributes! 
  end


  def destroy
    @piece.destroy 
    render json: @piece.as_json 
  end


  protected

  def piece_params
    params.require(:piece).permit(:name, :marker_units, :marker_width, :code, :scene, :assets, :marker)
  end

  def get_piece
    @piece = current_user.pieces.find_by_id(params[:id].to_i)
    head :not_found unless @piece
  end


  def space
    @space ||= current_user.spaces.find_by_id((params[:id] || params[:space_id]).to_i)
  end

end