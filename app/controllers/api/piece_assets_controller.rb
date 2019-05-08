class Api::PieceAssetsController < Api::BaseController

  before_action :get_piece, only: :create

  skip_before_action :check_token, only: :show

  def create
    assets = asset_params[:assets].values
    piece_asset = @piece.piece_assets.create(assets: assets)
    render json: piece_asset.to_builder.attributes!
  end


  def show
    piece_asset = PieceAsset.find_by_id(params[:id].to_i)

    filename = "#{params[:name]}.#{params[:format]}"

    piece_asset.assets.each do |asset|
      if asset.blob.filename.to_s == filename 
        redirect_to url_for(asset)
        return
      end
    end

    head 404
  end

  protected

  def asset_params
    params.permit(:assets => {})
  end

  def get_piece
    @piece = current_user.pieces.find_by_id(params[:piece_id].to_i)
    head :not_found unless @piece
  end 


end