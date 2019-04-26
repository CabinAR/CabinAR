class PiecesProperties < ActiveRecord::Migration[6.0]
  def change
    #remove_column :pieces, :callbacks
    add_column :pieces, :scene, :text
    add_column :pieces, :assets, :text
  end
end
