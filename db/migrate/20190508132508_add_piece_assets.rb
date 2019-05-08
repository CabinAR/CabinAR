class AddPieceAssets < ActiveRecord::Migration[6.0]
  def change

    create_table :piece_assets do |t|
      t.integer :piece_id
      t.string :name
    end
  end
end
