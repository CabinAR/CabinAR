class AddTypesToPieceAssets < ActiveRecord::Migration[6.0]
  def change
    add_column :piece_assets, :asset_type, :integer, default: 0
  end
end
